import React, { useRef, useEffect, useState } from 'react';
import { RunSummary } from '../types/game';
import { Translations } from '../services/i18n';
import { Download, X, Copy, Check } from 'lucide-react';

interface ShareCardModalProps {
  summary: RunSummary;
  t: Translations;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  summary,
  t,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Card dimensions (Social Card 1200 x 675 for OpenGraph / Twitter)
    canvas.width = 1200;
    canvas.height = 675;

    // Background parchment tone
    const grad = ctx.createLinearGradient(0, 0, 1200, 675);
    grad.addColorStop(0, '#1C1916');
    grad.addColorStop(0.5, '#171513');
    grad.addColorStop(1, '#0F0E0C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 675);

    // Classical Woodcut Border Frame
    ctx.strokeStyle = '#6B5D4D';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 615);

    ctx.strokeStyle = '#383026';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, 1116, 591);

    // Decorative corner crosses
    const corners = [
      [36, 36],
      [1164, 36],
      [36, 639],
      [1164, 639]
    ];
    ctx.fillStyle = '#C2A374';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Header Kicker
    ctx.font = '600 20px Cinzel, serif';
    ctx.fillStyle = '#A3917B';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF FUTILE VALOR · THE ETERNAL PUSH', 600, 105);

    // Main Score Display
    ctx.font = '900 68px Cinzel, serif';
    ctx.fillStyle = '#F5ECE1';
    ctx.fillText(`${summary.distance.toFixed(1)} METERS ASCENDED`, 600, 195);

    // Sub-metric
    ctx.font = '500 24px monospace';
    ctx.fillStyle = '#8C7E6C';
    ctx.fillText(`Endurance: ${summary.time.toFixed(1)}s  ·  Exertion Strokes: ${summary.pushes}  ·  Net Summit Gain: 0.0m`, 600, 245);

    // Separator line
    ctx.strokeStyle = '#4A3E31';
    ctx.beginPath();
    ctx.moveTo(350, 280);
    ctx.lineTo(850, 280);
    ctx.stroke();

    // Absurd Remark
    ctx.font = 'italic 28px Newsreader, serif';
    ctx.fillStyle = '#DECDB7';
    const remark = `“${summary.absurdRemark}”`;
    ctx.fillText(remark, 600, 345, 1000);

    // Classical Quote
    ctx.font = 'italic 20px Newsreader, serif';
    ctx.fillStyle = '#877B6D';
    ctx.fillText('“La lutte elle-même vers les sommets suffit à remplir un cœur d’homme. Il faut imaginer Sisyphe heureux.”', 600, 440);
    ctx.fillText('— Albert Camus, Le Mythe de Sisyphe (1942)', 600, 475);

    // Footer with timestamp & game URL
    const dateStr = new Date(summary.timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.font = '600 16px Cinzel, serif';
    ctx.fillStyle = '#A6957E';
    ctx.fillText(`TESTIFIED ON ${dateStr.toUpperCase()} · PLAY AT SISYPHUS-GAME.WEB.APP`, 600, 580);
  }, [summary]);

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `sisyphus-push-${Math.round(summary.distance)}m.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      handleDownloadImage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#161412] border border-[#3E3529] p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-cinzel text-lg font-bold text-[#F4EDE2]">
            {t.shareCardBtn}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#2C261F] text-[#8C806F] hover:text-[#E8E2D8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas Preview */}
        <div className="w-full aspect-[1200/675] rounded-xl overflow-hidden border border-[#3A3227] shadow-xl bg-black">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopyImage}
            className="py-2.5 px-4 rounded-xl text-xs font-medium text-[#D8CEBF] bg-[#24201A] hover:bg-[#312B24] border border-[#453D32] flex items-center gap-2 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Certificate'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            className="py-2.5 px-4 rounded-xl text-xs font-cinzel font-bold text-white bg-amber-700 hover:bg-amber-600 flex items-center gap-2 cursor-pointer transition-colors shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
