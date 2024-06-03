precision mediump float;

varying vec2 fragtexture;
uniform sampler2D fragSampler;
void main(){
    gl_FragColor = texture2D(fragSampler, fragtexture);
}