import { useEffect, useRef } from 'react';

interface ShaderBackgroundProps {
  enabled?: boolean;
  intensity?: number;
}

export default function ShaderBackground({ enabled = true, intensity = 1.0 }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth || 1280;
      const h = canvas.clientHeight || window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(syncSize)
      : null;

    if (resizeObserver) {
      resizeObserver.observe(canvas);
    }
    syncSize();

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;

void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;
    
    // Create a scrolling grid of "code-like" cells
    float grid = 40.0;
    vec2 gv = fract(uv * vec2(grid * (u_resolution.x/u_resolution.y), grid) + vec2(0.0, u_time * 0.2));
    
    // Distance to mouse for interactive glow
    float dist = distance(uv, mouse);
    float glow = smoothstep(0.4, 0.0, dist) * 0.5;
    
    // Binary/Matrix-like patterns
    float pattern = step(0.9, fract(sin(floor(uv.x * grid) * 12.9898 + floor((uv.y + u_time * 0.05) * grid) * 78.233) * 43758.5453));
    
    vec3 color = vec3(0.005, 0.01, 0.005); // Base deep dark
    color += vec3(0.0, 1.0, 0.2) * pattern * 0.06 * u_intensity; // Matrix pulses
    color += vec3(0.0, 0.5, 1.0) * glow * u_intensity; // Mouse interaction blue glow
    
    gl_FragColor = vec4(color, 1.0);
}`;

    function createShader(type: number, src: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uInt = gl.getUniformLocation(prog, 'u_intensity');

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = (t: number) => {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      if (uInt) gl.uniform1f(uInt, intensity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [enabled, intensity]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#0D0D0D]">
      <canvas
        id="shader-canvas-ANIMATION_1"
        ref={canvasRef}
        className="block w-full h-full opacity-90 transition-opacity duration-700"
      />
      <div className="scanlines absolute inset-0 opacity-40 mix-blend-overlay" />
    </div>
  );
}
