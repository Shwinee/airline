function resolve_rect(rect1, rect2) {
    let vector_x;
    let vector_y;

    vector_x = (rect1.x + (rect1.w/2)) - (rect2.x + (rect2.w/2));
    vector_y = (rect1.y + (rect1.h/2)) - (rect2.y + (rect2.h/2));

    let return_obj = {
      dir: "",
      x: 0,
      y: 0,
      w: rect1.w,
      h: rect1.h
    }

    if (Math.abs(vector_x / rect2.w) < Math.abs(vector_y / rect2.h)) {
      if (vector_y > 0) {
        return_obj.dir = "bellow";
        return_obj.x = rect1.x;
        return_obj.y = (rect2.y+rect2.h);
        
        return return_obj
      }else {
        return_obj.dir = "above";
        return_obj.x = rect1.x;
        return_obj.y = (rect2.y-rect1.h);

        return return_obj
      }
    }else {
      if (vector_x > 0) {
        return_obj.dir = "right";
        return_obj.x = (rect2.x+rect2.w);
        return_obj.y = rect1.y;

        return return_obj
      }else {
        return_obj.dir = "left";
        return_obj.x = (rect2.x-rect1.w);
        return_obj.y = rect1.y;

        return return_obj
      }
    }
  }