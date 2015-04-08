%#! /usr/bin/octave -qf
%printf ("%s\n", program_name ());
%arg_list = argv ();
%for i = 1:nargin
%  printf (" %s\n", arg_list{i});
%endfor
%

%function rainProb = Predictor(pic1, pic2, locY = 28, locX = 57)
function rainProb = Predictor(pic1, pic2, users)
      %pkg load image
      

      %locX = 57;  % your location:-8 makes 8px West
      %locY = 28; %              -65 makes 65px North

      %read the images
      %file1 = arg_list{1};
      %file2 = arg_list{2};
      
      %pic1 = imread(file1);
      %pic2 = imread(file2);
      
      %trim the text and banners off
      
      trim1(:,:,:) = pic1(17:496, 17:496, 1:3);
      trim2(:,:,:) = pic2(17:496, 17:496, 1:3);
      
      
      %index the colour maps
      
      %a colour map for the intensity colour chart, this was pulled from the BOM.gov.au legend overlay for IDR703
      m=[
              0   0   0
            245 245 255
            180 180 255
            120 120 255
             20  20 255
              0 216 195
              0 150 144
              0 102 102
            255 255   0
            255 200   0
            255 150   0
            255 100   0
            255   0   0
            200   0   0
            120   0   0
             40   0   0
      ];
      
      ind1 = indexer(trim1, m);
      ind2 = indexer(trim2, m);
      
      
      %calculate a velocity distribution for the images
      
      kernX = [
            1 0 -1
            1 0 -1
            1 0 -1
      ];
      
      kernY = kernX';
      
      
      
      dx1 = filter2(kernX, ind1, 'same'); %should be using 'valid' and handling the image sizes dynamically
      dx2 = filter2(kernX, ind2, 'same');
      flowX = filter2(dx1, dx2, 'full'); 
      clear dx1;    %ram hungry bugger.
      clear dx2;

      dy1 = filter2(kernY, ind1, 'same');
      dy2 = filter2(kernY, ind2, 'same');
      flowY = filter2(dy1, dy2, 'full');
      clear dy1;
      clear dy2;


      flow = ((flowX).^2) .* ((flowY).^2);  %only pay attention to motions deemed possible by both edge detectors.
      %flow = ((flowX).^2) .+ ((flowY).^2);
      
      %flow = filter2(ind1-1, ind2-1, 'full'); %this order makes the velocity vectors point into the wind


      clear flowX;
      clear flowY;
      
      flow = flow/max(flow(:));
      %flow = flow.*flow;      %squaring the chart makes the peak stand out better
      imwrite(flow, ['flow.png']);
      
      
      %print some stats
      
%      [f_max, f_index1] = max(flow);      %awful peak detector, not actually used
%      [f_max, f_col] = max(f_max);      
%      f_row = f_index1(f_col);
%      
%      [rows, cols] = size(flow);
%      r_mid = ceil(rows/2);
%      c_mid = ceil(cols/2);
%      v_rows = f_row - r_mid;
%      v_cols = f_col - c_mid;
%      
%      printf('%ipx south\n', v_rows)
%      printf('%ipx east\n', v_cols)
      
      
      

      
      
      %for every minute, calculate probabilities of a given intensity
      
      numusers = size(users, 1);
      timesteps = 30
      rainProb(timesteps, 16, numusers) = 0;
      
      for timestep = 1:timesteps
            timestep
      
            %scaling the velocity chart gives you timesteps
            clear ScaledFlow;
%1
            sFactor = (timestep/10);


            %crop to twice the initial image size
            [flowrows,flowcols] = size(flow);

            precroptop = max(1,   floor((flowrows/2) - (480/(sFactor)) + 1));   %top
            precropbot = min(flowrows, ceil((flowrows/2) + (480/(sFactor))));   %bottom
            precroplhs = max(1,   floor((flowcols/2) - (480/(sFactor)) + 1));   %lhs
            precroprhs = min(flowcols, ceil((flowcols/2) + (480/(sFactor))));   %rhs

            preCrop(:,:) = flow(precroptop:precropbot,precroplhs:precroprhs);

            %imwrite(preCrop/max(preCrop(:)), ['precrop', int2str(timestep) , '.png']);

            ScaledFlow = imresize(preCrop, (timestep/10), 'linear');

            clear preCrop;
            
            [sc_rows, sc_cols] = size(ScaledFlow);
%1

%            ScaledFlow = imresize(flow, (timestep/10), 'linear');     //hideously ram hungry



            %crop or pad the flow image to the size of the rain image so that its centre matches your location      


%2            scaledFlow = scalecrop(flow, (timestep/10), [960,960], [0, 0]);     %seperating the scale and crop operations:
         


            for u = 1:numusers
                  locX = users(u,2);
                  locY = users(u,3);
%1
                 %the bounds of the data in the cropped image
                 croptop =  max( 1,   ceil(480/2) - ceil(sc_rows/2) + locY +1 );
                 cropbot =  min( 480, ceil(480/2) + ceil(sc_rows/2) + locY    );
                 croplhs =  max( 1,   ceil(480/2) - ceil(sc_cols/2) + locX +1 );
                 croprhs =  min( 480, ceil(480/2) + ceil(sc_cols/2) + locX    );
     
                 %the bounds of the data from the scaled image
                 scaltop =  max( 1,       ceil(sc_rows/2) - ceil(480/2) - locY +1 );
                 scalbot =  min( sc_rows, ceil(sc_rows/2) + ceil(480/2) - locY    );
                 scallhs =  max( 1,       ceil(sc_cols/2) - ceil(480/2) - locX +1 );
                 scalrhs =  min( sc_cols, ceil(sc_cols/2) + ceil(480/2) - locX    );
           
                 cropheight = cropbot - croptop;
                 cropwidth = croprhs - croplhs;
           
                 scalheight = (scalbot - scaltop);
                 scalwidth = (scalrhs - scallhs);
     
                 clear cropFlow;
                 %initialise a cropped image
                 cropFlow(480,480) = 0;
                 %copy the relevant data
                 cropFlow(croptop:cropbot,croplhs:croprhs) = ScaledFlow(scaltop:scalbot, scallhs:scalrhs);
%1

%3
%3                  cropFlow = scalecrop(flow, (timestep/10), [480,480], [locY, locX]);     %shiny new C program does things quickly (for one user only)
%3

%2                  cropFlow = scalecrop(scaledFlow, 1, [480,480], [locY, locX]);     %
      
      
                  cropFlow = cropFlow/sum(cropFlow(:));   %normalising step to generate probabilities with consistent amplitude over different time scales

                  for colour = 1:16
                        %select a colour
                        picChannel = (ind1 == colour);
            
                        rainProbmap = cropFlow.*picChannel;
            
                        %imshow(rainProbmap/max(rainProbmap(:)))
                        
                        %colour
                        %rainProb(timestep, colour) = colour * sum(rainProbmap(:));  %make stronger signals stand out
            
                        rainProb(timestep, colour, u) = sum(rainProbmap(:)); % multiplying by colour kill the normalisation
                  end
            end
      end

%      for u = 1:numusers
%            userProb(:,:) = rainProb(:,:,u);
%            imwrite(userProb/max(userProb(:)), ['chart',int2str(users(u,1)),'.png']);
%      end
end