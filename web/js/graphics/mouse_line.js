export default class MouseLine {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.size = 50;
        this.start_x = 0;
        this.start_y = 0;
        this.color = "#00FF00";
        this.is_enabled = false;
        this.is_visible = false;
        this.is_scaled = true;
    }

    setStart(x, y) {
        this.start_x = x;
        this.start_y = y;
    }

    getLimitedMousePos() {
        let dx = this.x-this.start_x;
        let dy = this.y-this.start_y;
        if(this.is_scaled && Math.sqrt(dx*dx + dy*dy) > this.size) {
            let angle = Math.atan2(dy, dx);
            return { x: this.start_x + Math.cos(angle) * this.size, y: this.start_y + Math.sin(angle) * this.size };

        }
        return { x: this.x, y: this.y}
    }

    draw(ctxt) {
        if(!this.is_visible) { return; }

        ctxt.beginPath();
        ctxt.lineWidth = 2;
        ctxt.strokeStyle = this.color;
        ctxt.moveTo(this.start_x, this.start_y);

        let dx = this.x-this.start_x;
        let dy = this.y-this.start_y;
        if(this.is_scaled && Math.sqrt(dx*dx + dy*dy) < this.size) {
            ctxt.lineTo(this.x, this.y);
        } else {
            let angle = Math.atan2(dy, dx);
            ctxt.lineTo(this.start_x + Math.cos(angle)*this.size, this.start_y + Math.sin(angle) * this.size);
        }
        ctxt.stroke();
    }
}