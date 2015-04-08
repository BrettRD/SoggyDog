function indexed = indexert2(pic, map)
      [n_rows, n_cols, chans] = size(pic);
      n_colours = size(map,1);


      %for row= 1:n_rows
      %      for col = 1:n_cols
      %            colour = 1;
      %            while ((colour <= n_colours) && (!( (pic(row,col,1) == map(colour,1)) && (pic(row,col,2) == map(colour,2)) && (pic(row,col,3) == map(colour,3)) )))
      %                  colour++;
      %            end
      %            indexed(row,col) = colour;
      %      end
      %end

end
