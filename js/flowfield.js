let resolucion = parseFloat(640*0.01), left_x = parseFloat(640 * -0.5), right_x = parseFloat(640 * 1.5), top_y = parseFloat(704 * -0.5), bottom_y = parseFloat(704 * 1.5), num_columns = Math.round((right_x - left_x) / resolucion), num_rows = Math.round((bottom_y - top_y) / resolucion), flow_field = [], minAngle, step_length = 0.4*pixel;

// FLOW FIELD TYPES - Create the different Flow Fields
function createField (a) {
    switch (a) {
        case "curved":
            angleRange = rande(-25,-15);
            if (rande(0,100)%2 == 0) {angleRange=angleRange*-1}
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {               
                    var scaled_x = parseFloat((column) * 0.02);
                    var scaled_y = parseFloat((row) * 0.02);
                    var noise_val = noise(parseFloat(scaled_x.toFixed(3)), parseFloat(scaled_y.toFixed(3)))
                    var angle = map(noise_val, 0.0, 1.0, -angleRange, angleRange)
                    flow_field[column][row] = 3*angle;
                }
            }
            minAngle = 10;
        break;
        case "truncated":
            angleRange = rande(-25,-15);
            if (rande(0,100)%2 == 0) {angleRange=angleRange*-1}
            truncate = rande(5,10);
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {               
                    var scaled_x = parseFloat((column) * 0.02);
                    var scaled_y = parseFloat((row) * 0.02);
                    var noise_val = noise(parseFloat(scaled_x.toFixed(3)), parseFloat(scaled_y.toFixed(3)))
                    var angle = map(noise_val, 0.0, 1.0, -angleRange, angleRange)
                    var angle = round(angle/truncate)*truncate;
                    flow_field[column][row] = 4*angle;
                }
            }
            minAngle = 10;
        break;
        case "tilted":
            angleRange = rande(-45,-25);
            if (rande(0,100)%2 == 0) {angleRange=angleRange*-1}
            var dif = angleRange;
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                var angle = 0;
                for (row=0;row<num_rows;row++) {               
                    flow_field[column][row] = angle;
                    angle = angle + dif;
                    dif = -1*dif;
                }
            }
            minAngle = 20;
        break;
        case "zigzag":
            angleRange = rande(-30,-15);
            if (rande(0,100)%2 == 0) {angleRange=angleRange*-1}
            var dif = angleRange;
            var angle = 0;
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {               
                    flow_field[column][row] = angle;
                    angle = angle + dif;
                    dif = -1*dif;
                }
                angle = angle + dif;
                dif = -1*dif;
            }
            minAngle = 15;
        break;
        case "waves":
            sinrange = rande(10,15);
            cosrange = rande(3,6);
            baseAngle = rande(20,35);
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {               
                    angle = sin (sinrange*column)*(baseAngle*cos(row*cosrange)) + rande(-3,3);
                    flow_field[column][row] = angle;
                }
            }
            minAngle = 10;
        break;
        case "scales":
            baseSize = rand(0.3,0.8)
            baseAngle = rande(20,45);
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {       
                    addition = rande(row/65,row/35)        
                    angle = baseAngle*cos(baseSize*column*row)+addition;
                    flow_field[column][row] = angle;
                }
            }
            minAngle = 25;
        break;
        case "seabed":
            baseSize = rand(0.3,0.8)
            baseAngle = rande(18,26);
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {       
                    addition = rande(15,20)        
                    angle = baseAngle*sin(baseSize*row*column+addition);
                    flow_field[column][row] = 1.1*angle;
                }
            }
            minAngle = 22;
        break;
        case "partiture":
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {               
                    flow_field[column][row] = 0;
                }
            }
            minAngle = 10;
        break;
    }
}

// CURRENT POSITION in the FLOW FIELD, real scale
class Pos {
    constructor (x,y) {
        this.x = (x);
        this.y = (y);
        this.update(this.x,this.y);
        this.plotted = 0;
    }
    update (x,y) {
        this.x = x;
        this.y = y;
        this.x_offset = Math.round(10000*this.x/pixel)/10000-left_x;
        this.y_offset = Math.round(10000*this.y/pixel)/10000-top_y;
        this.column_index = Math.round(this.x_offset / resolucion);
        this.row_index = Math.round(this.y_offset / resolucion);
    }
    reset() {
        this.plotted = 0;
    }
    isIn() { // This will check if current position is inside field
        return ((this.column_index >= 0 && this.row_index >= 0) && (this.column_index < num_columns && this.row_index < num_rows))
    }
    isInCanvas() {
        return ((Math.round(1000*this.x/pixel)/1000 >= -0.05*640 && Math.round(1000*this.x/pixel)/1000 <= 1.05*640) && (Math.round(1000*this.y/pixel)/1000 >= -0.05*640 && Math.round(1000*this.y/pixel)/1000 <= 1.05*640))
    }
    angle () { // This will return the flow field angle for current position
        if (this.isIn()) {
            this.grid_angle = flow_field[this.column_index][this.row_index];
        } else {this.grid_angle = 0;}
        return (this.grid_angle);
    }
    moveTo (_length,_dir,_step_length,_debug) {
        if (typeof _step_length == 'undefined') {
            _step_length = 0.4;
        }
        this.num_steps = _length/_step_length;
        if (this.isIn()) {
            for (this.i=0;this.i<this.num_steps;this.i++) {
                this.update(this.x,this.y);   
                this.x_step = (pixel * _step_length * cos(this.angle()-_dir));
                this.y_step = (pixel * _step_length * sin(this.angle()-_dir));
                this.x = (this.x+this.x_step);
                this.y = (this.y+this.y_step);
                this.plotted = this.plotted+_step_length;
            }
        } else {
            this.plotted = this.plotted+_step_length;
        }
        this.update(this.x,this.y);
    }
    plotTo (_plot,_length,_step_length) {
        if (typeof _step_length == 'undefined') {
            _step_length = 0.4;
        }
        this.num_steps = _length/_step_length;
        if (this.isIn()) {
            for (this.i=0;this.i<this.num_steps;this.i++) {
                this.update(this.x,this.y);   
                this.x_step = (pixel * _step_length * cos(this.angle()-_plot.angle(this.plotted)));
                this.y_step = (pixel * _step_length * sin(this.angle()-_plot.angle(this.plotted)));
                this.x = (this.x+this.x_step);
                this.y = (this.y+this.y_step);
                this.plotted = this.plotted+_step_length;
            }
        } else {
            this.plotted = this.plotted+_step_length;
        }
        this.update(this.x,this.y);
    }
}