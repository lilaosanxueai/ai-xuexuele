/**
 * 实验演示截图：把当前 SVG 舞台导出为 PNG 下载（2 倍分辨率·白底）。
 */

/** 生成安全的下载文件名：实验-课题-日期时间.png */
export function buildShotName(title: string, now: Date = new Date()): string {
  const safe = title.replace(/[\\/:*?"<>|\s]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || '演示';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `实验-${safe}-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.png`;
}

/** SVG → 白底画布（序列化栅格化的共用管线） */
function renderToCanvas(svg: SVGSVGElement, scale: number): Promise<HTMLCanvasElement> {
  const rect = svg.getBoundingClientRect();
  const w = Math.max(320, Math.round(rect.width));
  const h = Math.max(240, Math.round(rect.height));
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(w));
  clone.setAttribute('height', String(h));
  const data = new XMLSerializer().serializeToString(clone);
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('canvas 不可用')); return; }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error('SVG 渲染失败'));
    img.src = url;
  });
}

export function exportSvgToPng(svg: SVGSVGElement, filename: string): Promise<void> {
  return renderToCanvas(svg, 2).then((canvas) => new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('导出失败')); return; }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      resolve();
    }, 'image/png');
  }));
}

/** SVG → PNG dataURL（作品墙缩略图用：长边压到 720，控制在服务端 300k 字符限制内） */
export function svgToDataUrl(svg: SVGSVGElement, maxSide = 720): Promise<string> {
  const rect = svg.getBoundingClientRect();
  const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
  const scale = Math.min(maxSide / w, maxSide / h, 2);
  return renderToCanvas(svg, scale).then((canvas) => canvas.toDataURL('image/png'));
}
