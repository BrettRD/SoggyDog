


function radarFlow(file1, file2)
	
	
	pic1 = imload(file1);
	pic2 = imload(file2);
	
	
	trim1(:,:,:) = pic1(17:496, 17:496, 1:3);
	trim2(:,:,:) = pic1(17:496, 17:496, 1:3);
	
	%a colour map for the intensity colour chart, this was pulled from the BOM.gov.au legend overlay for IDR703
	m=[
		245 245 255
		180 180 255
		120 120 255
		 20  20 255
		  0 216 195
		  0 150 144
		255 255   0
		255 200   0
		255 150   0
		255 100   0
		255   0   0
		200   0   0
		120   0   0
		 40   0   0
	];
	
	
	%intensity chart
	chart1 = rgb2ind(trim1, m);
	chart2 = rgb2ind(trim2, m);

	imshow(chart1)

	
	%match = filter2(chart1, chart2, 'full');
	
	%imshow( match/(max(match(:))))

end
