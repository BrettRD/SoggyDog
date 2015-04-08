


function flow = radarFlow(file1, file2)
      
      
      pic1 = imread(file1);
      pic2 = imread(file2);
      
      
      trim1(:,:,:) = pic1(17:496, 17:496, 1:3);
      trim2(:,:,:) = pic2(17:496, 17:496, 1:3);
      %size(trim1)
      %size(trim2)      
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
      %size(ind1)
      %size(ind2)
      flow = filter2(ind1, ind2, 'full');
      %size(flow)

      %imshow(flow/max(flow(:)))
      imwrite(flow/max(flow(:)), ['flow',file1]);
      
      %match = filter2(chart1, chart2, 'full');
      
      %imshow( match/(max(match(:))))

end
