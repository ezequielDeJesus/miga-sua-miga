/**
 * Nano Banana AI Utility
 * Powered by Google Gemini Image Generation API.
 * Falls back to Canvas simulation if no API key is configured.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-3-pro-image-preview'; // Conhecido internamente como Nano Banana Pro
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

// Diagnóstico: verificar se a chave está carregada
if (!API_KEY || API_KEY === 'cole_sua_chave_aqui') {
    console.warn('⚠️ NanoBanana: VITE_GEMINI_API_KEY não encontrada. Reinicie o servidor após editar o .env.local');
} else {
    console.log('✅ NanoBanana: API Key carregada com sucesso! (' + API_KEY.slice(0, 8) + '...)');
}

// Convert a base64 Data URL to { mimeType, data }
function parseDataUrl(dataUrl) {
    const [header, data] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)[1];
    return { mimeType, data };
}

// Send a request to the Gemini Image Generation API
async function callGeminiImage(parts) {
    const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || 'Gemini API error');
    }

    const result = await response.json();
    const imagePart = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!imagePart) throw new Error('No image returned from Gemini');

    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}

export const NanoBananaAI = {

    /**
     * AI Try-On: Veste o vestido na noiva usando Gemini
     */
    async simulateTryOn(brideSrc, dressSrc) {
        if (!API_KEY || API_KEY === 'cole_sua_chave_aqui') {
            console.warn('⚠️ NanoBanana: API Key não configurada. Usando Canvas.');
            return this._canvasTryOn(brideSrc, dressSrc);
        }

        console.log('🍌 NanoBanana: Chamando Gemini API para Try-On...');
        try {
            const bride = parseDataUrl(brideSrc);
            const dress = parseDataUrl(dressSrc);

            const parts = [
                {
                    text: `CRITICAL GOAL: Re-draw Image 1 EXACTLY pixel-by-pixel, but change ONLY the clothing.
                    
                    STRICT REQUIREMENTS:
                    1. The woman's face, hair, body position, pose, hands, arms, feet, and SHOES MUST remain identically in the exact same place as Image 1. DO NOT remove her shoes or feet.
                    2. The environment, floor, and background MUST remain exactly the same as Image 1. DO NOT change the room, the walls, or adding new background elements.
                    3. Do not add any new people. Only the original woman from Image 1 can exist.
                    4. Take the wedding dress from Image 2 and paint it directly onto her body, tracing her original curves and arms. 
                    5. Ensure the final result looks like someone just painted the dress from Image 2 over her original clothes without changing the photo's anatomy, geometry or background.
                    Add a tiny watermark "Nano Banana AI" to the bottom left.`
                },
                { inlineData: { mimeType: bride.mimeType, data: bride.data } },
                { inlineData: { mimeType: dress.mimeType, data: dress.data } }
            ];

            const result = await callGeminiImage(parts);
            console.log('✅ NanoBanana: Imagem gerada com sucesso!');
            return result;
        } catch (error) {
            console.error('❌ NanoBanana API Error (Try-On):', error.message);
            console.warn('↩️ Usando Canvas como fallback...');
            return this._canvasTryOn(brideSrc, dressSrc);
        }
    },

    /**
     * AI Decoration: Transforma o ambiente com o estilo escolhido
     */
    async simulateDecoration(roomSrc, style, elements = []) {
        if (!API_KEY || API_KEY === 'cole_sua_chave_aqui') {
            console.warn('NanoBanana: API Key não configurada. Usando simulação Canvas.');
            return this._canvasDecoration(roomSrc, style, elements);
        }

        try {
            const room = parseDataUrl(roomSrc);
            const elementsList = elements.length > 0 ? elements.join(', ') : 'elegant wedding details';

            const styleDescriptions = {
                'clássico': 'classic, timeless, romantic, dusty rose and ivory tones, soft lighting',
                'luxuoso': 'luxurious, opulent, gold accents, dramatic lighting, chandelier, rich textures',
                'minimalista': 'minimalist, clean lines, white and sage green, natural light, modern'
            };
            const styleDesc = styleDescriptions[style] || 'elegant wedding';

            const parts = [
                {
                    text: `You are an expert wedding interior designer and AI image editor. 
                    Transform this venue/room photo into a stunning ${styleDesc} wedding decoration scene.
                    Add ${elementsList} that blend naturally with the existing space.
                    Keep the original room structure and architecture intact.
                    Make the lighting, colors and atmosphere match the "${style}" style.
                    The result should look like a real professionally decorated wedding venue.
                    Add a subtle watermark "Nano Banana AI • Scene: ${style}" at the bottom left.`
                },
                { inlineData: { mimeType: room.mimeType, data: room.data } }
            ];

            return await callGeminiImage(parts);
        } catch (error) {
            console.error('NanoBanana API Error:', error.message);
            console.warn('Usando simulação Canvas como fallback...');
            return this._canvasDecoration(roomSrc, style, elements);
        }
    },

    // ─── Canvas Fallback ────────────────────────────────────────────────────

    addBranding(ctx, width, height, text = 'Nano Banana AI • Realistic Try-on') {
        ctx.save();
        ctx.font = "bold 24px 'Plus Jakarta Sans'";
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'white';
        ctx.fillText(text, 30, height - 30);
        ctx.restore();
    },

    _canvasTryOn(brideSrc, dressSrc) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const brideImg = new Image();
            const dressImg = new Image();

            brideImg.onload = () => {
                canvas.width = brideImg.width;
                canvas.height = brideImg.height;
                ctx.drawImage(brideImg, 0, 0);

                dressImg.onload = () => {
                    const dScale = (canvas.height * 0.68) / dressImg.height;
                    const dWidth = dressImg.width * dScale;
                    const dHeight = dressImg.height * dScale;
                    const dx = (canvas.width - dWidth) / 2;
                    const dy = canvas.height * 0.20;

                    ctx.save();
                    ctx.shadowBlur = 60;
                    ctx.shadowColor = 'rgba(181, 101, 118, 0.4)';
                    ctx.globalAlpha = 0.95;
                    ctx.drawImage(dressImg, dx, dy, dWidth, dHeight);
                    ctx.restore();

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    this.addBranding(ctx, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.85));
                };
                dressImg.src = dressSrc;
            };
            brideImg.src = brideSrc;
        });
    },

    _canvasDecoration(roomSrc, style, elements = []) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const roomImg = new Image();

            roomImg.onload = () => {
                canvas.width = roomImg.width;
                canvas.height = roomImg.height;

                if (style === 'clássico') {
                    ctx.filter = 'contrast(1.1) brightness(1.05)';
                } else if (style === 'luxuoso') {
                    ctx.filter = 'saturate(1.2) brightness(1.15) contrast(1.05)';
                } else if (style === 'minimalista') {
                    ctx.filter = 'grayscale(30%) brightness(1.05) contrast(0.9)';
                }

                ctx.drawImage(roomImg, 0, 0);
                ctx.filter = 'none';

                if (style === 'clássico') {
                    ctx.fillStyle = 'rgba(181, 130, 126, 0.12)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else if (style === 'luxuoso') {
                    ctx.fillStyle = 'rgba(255, 215, 0, 0.08)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                this.addBranding(ctx, canvas.width, canvas.height, `Nano Banana AI • Scene: ${style}`);
                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
            roomImg.src = roomSrc;
        });
    }
};
