const { useState, useEffect, useRef, useCallback } = React;

// ==================== Loader 渲染器 ====================
const LoaderRenderer = ({ config, width, height, isPlaying }) => {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const phaseMap = useRef({});
    const timeRef = useRef(0);
    const particleSystemRef = useRef(null);

    const draw = useCallback((ctx, w, h, time) => {
        const {
            layout, shape, color, glowColor, glowIntensity, bgContrast, speed,
            easing, pattern, phaseDelay, cols, rows, gap, cellSize,
            aspectRatio, cornerRadius, rotation, particleCount, connectionDist, glitchIntensity,
            colorOpacity, glowOpacity, pageBgVisible, colorVisible, glowVisible
        } = config;
        const cOpacity = colorVisible === false ? 0 : (colorOpacity ?? 100) / 100;
        const gOpacity = glowVisible === false ? 0 : (glowOpacity ?? 100) / 100;

        ctx.clearRect(0, 0, w, h);
        if (pageBgVisible !== false) {
            const bgL = Math.floor(255 * (1 - bgContrast / 100));
            ctx.fillStyle = `rgba(${bgL * 0.06}, ${bgL * 0.08}, ${bgL * 0.1}, 0.3)`;
            ctx.fillRect(0, 0, w, h);
        }

        if (glitchIntensity > 0 && Math.random() < glitchIntensity * 0.1) {
            ctx.fillStyle = `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, ${0.04 * cOpacity})`;
            const gy = Math.floor(Math.random() * h);
            ctx.fillRect(0, gy, w, Math.random() * 10 + 2);
        }

        const easingFn = EASINGS[easing] || EASINGS.linear;
        const patternFn = PATTERNS[pattern] || PATTERNS.wave;

        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const gr = parseInt((glowColor || color).slice(1, 3), 16);
        const gg = parseInt((glowColor || color).slice(3, 5), 16);
        const gb = parseInt((glowColor || color).slice(5, 7), 16);

        const drawShape = (ctx, shape, x, y, cw, ch, radius) => {
            if (shape === 'rect') { drawRoundedRect(ctx, x, y, cw, ch, radius * 2); ctx.fill(); }
            else if (shape === 'circle') { ctx.beginPath(); ctx.arc(x + cw / 2, y + ch / 2, Math.min(cw, ch) / 2, 0, Math.PI * 2); ctx.fill(); }
            else if (shape === 'square') { ctx.fillRect(x, y, cw, ch); }
            else if (shape === 'diamond') { drawDiamond(ctx, x, y, cw, ch); ctx.fill(); }
        };

        if (layout === 'particles') {
            const pCount = particleCount || 30;
            if (!particleSystemRef.current || particleSystemRef.current.particles.length !== pCount) {
                particleSystemRef.current = new ParticleSystem(pCount, w, h);
            }
            particleSystemRef.current.update(time, w, h, pattern);
            particleSystemRef.current.particles.forEach(p => {
                const val = easingFn(Math.max(0, Math.min(1, (Math.sin(time * 2 + p.phase) + 1) / 2)));
                const alpha = (0.2 + val * 0.8) * cOpacity;
                const sz = p.size * (0.5 + val * 0.5);
                ctx.save();
                if (glowIntensity > 0) { ctx.shadowColor = `rgba(${gr},${gg},${gb},${gOpacity})`; ctx.shadowBlur = glowIntensity * val * 2; }
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                const radius = (cornerRadius / 100) * sz;
                drawShape(ctx, shape, p.x - sz, p.y - sz, sz * 2, sz * 2, radius);
                ctx.restore();
            });
            return;
        }

        if (layout === 'network') {
            const pCount = particleCount || 20;
            if (!particleSystemRef.current || particleSystemRef.current.particles.length !== pCount) {
                particleSystemRef.current = new ParticleSystem(pCount, w, h);
            }
            particleSystemRef.current.update(time, w, h, pattern);
            const dist = connectionDist || 80;
            const pts = particleSystemRef.current.particles;
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < dist) {
                        const lineAlpha = (1 - d / dist) * 0.5 * cOpacity;
                        ctx.strokeStyle = `rgba(${r},${g},${b},${lineAlpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
                    }
                }
            }
            pts.forEach(p => {
                const val = (Math.sin(time * 2 + p.phase) + 1) / 2;
                ctx.save();
                if (glowIntensity > 0) { ctx.shadowColor = `rgba(${gr},${gg},${gb},${gOpacity})`; ctx.shadowBlur = glowIntensity * 0.8; }
                ctx.fillStyle = `rgba(${r},${g},${b},${(0.5 + val * 0.5) * cOpacity})`;
                const sz = p.size * 0.7;
                const radius = (cornerRadius / 100) * sz;
                drawShape(ctx, shape, p.x - sz, p.y - sz, sz * 2, sz * 2, radius);
                ctx.restore();
            });
            return;
        }

        if (layout === 'ring') {
            const ringCount = Math.max(2, Math.floor(Math.min(cols, rows) / 2) + 1);
            const maxR = Math.min(w, h) * 0.42;
            const cx = w / 2, cy = h / 2;
            for (let ri = 0; ri < ringCount; ri++) {
                const ringR = maxR * (ri + 1) / ringCount;
                const dotCount = Math.max(4, Math.floor(ringR * 0.15));
                for (let di = 0; di < dotCount; di++) {
                    const angle = (di / dotCount) * Math.PI * 2 + ri * 0.3;
                    let rawValue = patternFn(di, ri, dotCount, ringCount, time + phaseDelay * (ri + di), phaseMap);
                    const val = easingFn(Math.max(0, Math.min(1, rawValue)));
                    const px = cx + Math.cos(angle + time * 0.3 * (ri % 2 === 0 ? 1 : -1)) * ringR;
                    const py = cy + Math.sin(angle + time * 0.3 * (ri % 2 === 0 ? 1 : -1)) * ringR;
                    const dotSize = 2 + val * 4;
                    ctx.save();
                    if (glowIntensity > 0) { ctx.shadowColor = `rgba(${gr},${gg},${gb},${gOpacity})`; ctx.shadowBlur = glowIntensity * val * 2; }
                    ctx.fillStyle = `rgba(${r},${g},${b},${(0.15 + val * 0.85) * cOpacity})`;
                    const rad = (cornerRadius / 100) * dotSize;
                    drawShape(ctx, shape, px - dotSize, py - dotSize, dotSize * 2, dotSize * 2, rad);
                    ctx.restore();
                }
            }
            return;
        }

        if (layout === 'spiral') {
            const totalDots = Math.max(20, (particleCount || 0) > 0 ? particleCount : cols * rows);
            const maxR = Math.min(w, h) * 0.42;
            const cx = w / 2, cy = h / 2;
            const turns = 3 + totalDots / 30;
            for (let i = 0; i < totalDots; i++) {
                const t2 = i / totalDots;
                const angle = t2 * turns * Math.PI * 2 + time * 0.5;
                const radius = t2 * maxR;
                let rawValue = patternFn(i, 0, totalDots, 1, time + phaseDelay * i, phaseMap);
                const val = easingFn(Math.max(0, Math.min(1, rawValue)));
                const px = cx + Math.cos(angle) * radius;
                const py = cy + Math.sin(angle) * radius;
                const dotSize = 2 + val * (3 + t2 * 3);
                ctx.save();
                if (glowIntensity > 0) { ctx.shadowColor = `rgba(${gr},${gg},${gb},${gOpacity})`; ctx.shadowBlur = glowIntensity * val * 2; }
                ctx.fillStyle = `rgba(${r},${g},${b},${(0.1 + val * 0.9) * cOpacity})`;
                const rad = (cornerRadius / 100) * dotSize;
                drawShape(ctx, shape, px - dotSize, py - dotSize, dotSize * 2, dotSize * 2, rad);
                ctx.restore();
            }
            return;
        }

        if (layout === 'matrix') {
            const charSet = '01{}[]()<>=>!==&&||+-*/%#@$_.:;?^~const let var if else for while return function class import export async await';
            const fontSize = Math.max(8, Math.min(w, h) / Math.max(cols, rows) * 0.6);
            ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            const cw = w / cols, ch = h / rows;
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    let rawValue = patternFn(i, j, cols, rows, time + phaseDelay * (i + j), phaseMap);
                    if (glitchIntensity > 0 && Math.random() < glitchIntensity * 0.05) rawValue = Math.random();
                    const val = easingFn(Math.max(0, Math.min(1, rawValue)));
                    const alpha = (0.05 + val * 0.95) * cOpacity;
                    const cx = cw * i + cw / 2, cy = ch * j + ch / 2;
                    ctx.save();
                    if (glowIntensity > 0) { ctx.shadowColor = `rgba(${gr},${gg},${gb},${gOpacity})`; ctx.shadowBlur = glowIntensity * val * 2; }
                    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                    const charIdx = Math.floor((time * 3 + i * 7 + j * 13) % charSet.length);
                    ctx.fillText(charSet[charIdx], cx, cy);
                    ctx.restore();
                }
            }
            return;
        }

        // grid layout
        const totalGapX = (cols - 1) * gap;
        const totalGapY = (rows - 1) * gap;
        const availableWidth = w - totalGapX;
        const availableHeight = h - totalGapY;
        const baseCellW = (availableWidth / cols) * (cellSize / 100);
        const baseCellH = (availableHeight / rows) * (cellSize / 100);
        
        let cellW = aspectRatio >= 1 ? baseCellW * Math.min(aspectRatio, 3) : baseCellW;
        let cellH = aspectRatio < 1 ? baseCellH / Math.max(aspectRatio, 0.2) : baseCellH;
        cellW = Math.min(cellW, baseCellW * 1.5);
        cellH = Math.min(cellH, baseCellH * 1.5);

        const offsetX = (w - (baseCellW * cols + totalGapX)) / 2 + (baseCellW - cellW) / 2;
        const offsetY = (h - (baseCellH * rows + totalGapY)) / 2 + (baseCellH - cellH) / 2;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let rawValue = patternFn(i, j, cols, rows, time + phaseDelay * (i + j), phaseMap);
                if (glitchIntensity > 0 && Math.random() < glitchIntensity * 0.05) rawValue = Math.random();
                const easedValue = easingFn(Math.max(0, Math.min(1, rawValue)));
                const x = offsetX + i * (baseCellW + gap);
                const y = offsetY + j * (baseCellH + gap);
                const baseAlpha = 0.15 + easedValue * 0.85;
                const alpha = baseAlpha * cOpacity;
                
                ctx.save();
                if (rotation !== 0) {
                    const cx = x + cellW / 2, cy = y + cellH / 2;
                    ctx.translate(cx, cy);
                    ctx.rotate(rotation * Math.PI / 180);
                    ctx.translate(-cx, -cy);
                }
                if (glitchIntensity > 0 && Math.random() < glitchIntensity * 0.03) ctx.translate(randomRange(-3, 3), 0);
                if (glowIntensity > 0) {
                    ctx.shadowColor = `rgba(${gr}, ${gg}, ${gb}, ${gOpacity})`;
                    ctx.shadowBlur = glowIntensity * easedValue * 3;
                }
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                const radius = (cornerRadius / 100) * Math.min(cellW, cellH) / 2;
                drawShape(ctx, shape, x, y, cellW, cellH, radius);
                ctx.restore();
            }
        }
    }, [config]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const animate = () => {
            if (isPlaying) timeRef.current += config.speed * 0.02;
            draw(ctx, width, height, timeRef.current);
            animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, [draw, config.speed, isPlaying, width, height]);

    return <canvas ref={canvasRef} style={{ width: width + 'px', height: height + 'px', display: 'block' }} />;
};

// ==================== 可拖拽数字输入 ====================
const DragInput = ({ value, onChange, min, max, step = 1, style, className, suffix }) => {
    const ref = useRef(null);
    const accumRef = useRef(0);

    const handleMouseDown = (e) => {
        if (document.activeElement === ref.current) return;
        const startX = e.clientX;
        const startVal = parseFloat(value) || 0;
        let dragging = false;
        accumRef.current = 0;

        const sensitivity = step < 1 ? 0.3 : 1;

        const onMove = (ev) => {
            const dx = ev.clientX - startX;
            if (!dragging && Math.abs(dx) > 2) {
                dragging = true;
                ref.current && ref.current.blur();
                document.body.style.cursor = 'ew-resize';
                document.body.style.userSelect = 'none';
                window.getSelection && window.getSelection().removeAllRanges();
            }
            if (dragging) {
                const mult = ev.shiftKey ? 10 : ev.altKey ? 0.1 : 1;
                let nv = startVal + dx * step * sensitivity * mult;
                if (min !== undefined) nv = Math.max(min, nv);
                if (max !== undefined) nv = Math.min(max, nv);
                nv = step < 1 ? parseFloat(nv.toFixed(String(step).split('.')[1]?.length || 2)) : Math.round(nv);
                onChange(nv);
            }
        };
        const onUp = () => {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            if (!dragging && ref.current) {
                ref.current.focus();
                ref.current.select();
            }
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    const handleChange = (e) => {
        let v = step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value);
        if (isNaN(v)) v = min || 0;
        if (min !== undefined) v = Math.max(min, v);
        if (max !== undefined) v = Math.min(max, v);
        onChange(v);
    };

    const baseStyle = {
        background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: 4,
        color: '#ccc', padding: '4px 8px', fontSize: 12, cursor: 'ew-resize',
        ...style
    };

    if (suffix) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <input ref={ref} type="number" value={value} min={min} max={max} step={step}
                    onChange={handleChange} onMouseDown={handleMouseDown}
                    className={className || ''} style={baseStyle} />
                <span style={{ fontSize: 11, color: '#666', flexShrink: 0 }}>{suffix}</span>
            </div>
        );
    }

    return (
        <input ref={ref} type="number" value={value} min={min} max={max} step={step}
            onChange={handleChange} onMouseDown={handleMouseDown}
            className={className || ''} style={baseStyle} />
    );
};

// ==================== 主应用 ====================
const App = () => {
    const [canvasName, setCanvasName] = useState('未命名画布');
    const [canvasBg, setCanvasBg] = useState({ color: '#1E1E1E', opacity: 100, visible: true });
    const [editingCanvasName, setEditingCanvasName] = useState(false);
    const [pages, setPages] = useState([]);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [activeTool, setActiveTool] = useState('move');
    const [viewState, setViewState] = useState({ x: 0, y: 0, zoom: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [viewStart, setViewStart] = useState({ x: 0, y: 0 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
    const [drawPreview, setDrawPreview] = useState(null);
    const [editingPageId, setEditingPageId] = useState(null);
    const [draggingPageId, setDraggingPageId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizing, setResizing] = useState(null);
    const [rightTab, setRightTab] = useState('design');
    const [exportFormat, setExportFormat] = useState('png');
    const canvasRef = useRef(null);
    const viewStateRef = useRef(viewState);
    viewStateRef.current = viewState;
    const touchRef = useRef({ startDist: 0, startZoom: 1, midX: 0, midY: 0, startViewX: 0, startViewY: 0, startX: 0, startY: 0, pinching: false, panning: false });

    const selectedPage = pages.find(p => p.id === selectedPageId);
    const config = selectedPage?.config || EMPTY_CONFIG;

    const canvasBgStyle = canvasBg.visible
        ? { backgroundColor: canvasBg.color, opacity: 1 }
        : { backgroundColor: '#0a0a0a' };

    const screenToCanvas = (sx, sy) => ({
        x: (sx - viewStateRef.current.x) / viewStateRef.current.zoom,
        y: (sy - viewStateRef.current.y) / viewStateRef.current.zoom
    });

    const saveProject = () => {
        const project = {
            version: 1,
            type: 'glow-animation',
            canvasName,
            canvasBg,
            viewState,
            pages: pages.map(p => ({
                id: p.id, name: p.name,
                x: p.x, y: p.y,
                width: p.width, height: p.height,
                config: p.config,
                isPlaying: false
            }))
        };
        const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${canvasName || '未命名画布'}.glow`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const loadProjectFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const project = JSON.parse(e.target.result);
                if (project.type !== 'glow-animation') {
                    alert('不是有效的光流动画文件');
                    return;
                }
                if (project.canvasName) setCanvasName(project.canvasName);
                if (project.canvasBg) setCanvasBg(project.canvasBg);
                if (project.viewState) setViewState(project.viewState);
                if (project.pages && Array.isArray(project.pages)) {
                    setPages(project.pages.map(p => ({
                        ...p,
                        config: { ...EMPTY_CONFIG, ...p.config },
                        isPlaying: false
                    })));
                }
                setSelectedPageId(null);
            } catch (err) {
                alert('文件解析失败: ' + err.message);
            }
        };
        reader.readAsText(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.glow') || file.name.endsWith('.json'))) {
            loadProjectFile(file);
        }
    };

    const addPage = () => {
        const newId = `page${Date.now()}`;
        const rect = canvasRef.current?.getBoundingClientRect();
        const cw = rect ? rect.width : 800;
        const ch = rect ? rect.height : 600;
        const vs = viewStateRef.current;
        const offset = pages.length * 40;
        const cx = (-vs.x + cw / 2) / vs.zoom - 150 + offset;
        const cy = (-vs.y + ch / 2) / vs.zoom - 100 + offset;
        setPages(prev => [...prev, {
            id: newId,
            name: `页面 ${prev.length + 1}`,
            x: cx, y: cy,
            width: 300, height: 200,
            config: { ...EMPTY_CONFIG },
            isPlaying: false
        }]);
        setSelectedPageId(newId);
    };

    const deletePage = (id) => {
        setPages(prev => prev.filter(p => p.id !== id));
        if (selectedPageId === id) setSelectedPageId(null);
    };

    const renamePage = (id, newName) => {
        setPages(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
    };

    const togglePagePlay = (id) => {
        setPages(prev => prev.map(p => p.id === id ? { ...p, isPlaying: !p.isPlaying } : p));
    };

    const updatePageConfig = (newConfig) => {
        if (!selectedPageId) return;
        setPages(prev => prev.map(p =>
            p.id === selectedPageId ? { ...p, config: newConfig } : p
        ));
    };

    const randomizeAnimation = () => {
        if (!selectedPage) return;
        const layouts = ['grid', 'matrix', 'particles', 'network', 'ring', 'spiral'];
        const patterns = ['wave', 'scan', 'pulse', 'random', 'ripple', 'checkerboard', 'typing', 'waterfall', 'breathe', 'orbit', 'zigzag', 'spiralScan', 'rain', 'heartbeat'];
        const easings = ['linear', 'sine', 'sineInOut', 'elastic', 'bounce', 'expo', 'back', 'cubic', 'quart', 'circ', 'steps'];
        const shapes = ['rect', 'circle', 'square', 'diamond'];
        const colors = ['#3A68FF', '#22c55e', '#ef4444', '#f59e0b', '#06b6d4', '#6B8FFF', '#ec4899', '#3b82f6', '#34d399', '#fb923c', '#e2e8f0', '#fbbf24', '#f472b6', '#a3e635', '#38bdf8', '#facc15', '#fb7185', '#c084fc'];
        const pick = arr => arr[Math.floor(Math.random() * arr.length)];
        const randInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
        const randFloat = (min, max, dec = 1) => parseFloat((min + Math.random() * (max - min)).toFixed(dec));
        const layout = pick(layouts);
        const color = pick(colors);
        const glowColor = Math.random() > 0.3 ? pick(colors) : color;
        const base = {
            layout,
            pattern: pick(patterns),
            easing: pick(easings),
            shape: pick(shapes),
            color,
            glowColor,
            glowIntensity: randInt(0, 80),
            bgContrast: randInt(70, 100),
            speed: randFloat(0.3, 2.5, 1),
            phaseDelay: randFloat(0, 0.8, 2),
            cornerRadius: randInt(0, 50),
            rotation: pick([0, 0, 0, 15, 30, 45, 60, 90]),
            glitchIntensity: Math.random() > 0.7 ? randFloat(0, 0.5, 2) : 0,
            aspectRatio: 1,
            cols: randInt(2, 8),
            rows: randInt(2, 8),
            gap: randInt(2, 16),
            cellSize: randInt(50, 95),
            particleCount: randInt(15, 60),
            connectionDist: randInt(60, 140),
            pageBg: selectedPage.config.pageBg || '#0a0a0a',
            pageBgVisible: selectedPage.config.pageBgVisible,
            pageBgOpacity: selectedPage.config.pageBgOpacity,
            colorOpacity: randInt(60, 100),
            glowOpacity: randInt(40, 100),
            colorVisible: selectedPage.config.colorVisible,
            glowVisible: selectedPage.config.glowVisible,
        };
        if (layout === 'matrix') {
            base.cols = randInt(8, 20);
            base.rows = randInt(8, 20);
        } else if (layout === 'particles') {
            base.particleCount = randInt(15, 60);
        } else if (layout === 'network') {
            base.particleCount = randInt(10, 35);
            base.connectionDist = randInt(60, 150);
        } else if (layout === 'ring') {
            base.cols = randInt(3, 8);
            base.rows = randInt(3, 8);
        } else if (layout === 'spiral') {
            base.particleCount = randInt(30, 90);
        }
        updatePageConfig(base);
    };

    const applyPreset = (preset) => {
        if (!selectedPageId) return;
        updatePageConfig({ ...EMPTY_CONFIG, ...preset });
    };

    const exportPNG = (scale = 1) => {
        if (!selectedPage) return;
        const el = document.querySelector(`[data-page-id="${selectedPage.id}"] canvas`);
        if (!el) return;
        const c = document.createElement('canvas');
        const w = selectedPage.width * scale;
        const h = selectedPage.height * scale;
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        if (selectedPage.config.pageBgVisible !== false) {
            const hex = (selectedPage.config.pageBg || '#0a0a0a').replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16) || 0;
            const g = parseInt(hex.substring(2, 4), 16) || 0;
            const b = parseInt(hex.substring(4, 6), 16) || 0;
            const a = (selectedPage.config.pageBgOpacity ?? 100) / 100;
            ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
            ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(el, 0, 0, w, h);
        c.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedPage.name || 'export'}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    };

    const exportCode = () => {
        if (!selectedPage) return;
        const cfg = selectedPage.config;
        const w = selectedPage.width;
        const h = selectedPage.height;
        const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${selectedPage.name || '光流动画'}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0a0a0a; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
.loader-container {
  width: ${w}px; height: ${h}px; border-radius: 8px; overflow: hidden;
  ${cfg.pageBgVisible !== false ? `background: ${cfg.pageBg || '#0a0a0a'};` : ''}
}
canvas { display: block; }
</style>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
</head>
<body>
<div class="loader-container">
  <canvas id="c" width="${w}" height="${h}"></canvas>
</div>
<script>
const config = ${JSON.stringify(cfg, null, 2)};

const EASINGS = {
  linear: t => t,
  sine: t => (Math.sin(t * Math.PI - Math.PI / 2) + 1) / 2,
  sineInOut: t => -(Math.cos(Math.PI * t) - 1) / 2,
  elastic: t => { if (t === 0) return 0; if (t === 1) return 1; return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1; },
  bounce: t => { const n1 = 7.5625, d1 = 2.75; if (t < 1/d1) return n1*t*t; else if (t < 2/d1) return n1*(t-=1.5/d1)*t+0.75; else if (t < 2.5/d1) return n1*(t-=2.25/d1)*t+0.9375; return n1*(t-=2.625/d1)*t+0.984375; },
  expo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  back: t => { const c1 = 1.70158, c3 = c1 + 1; return c3*t*t*t - c1*t*t; }
};

const PATTERNS = {
  wave: (i,j,c,r,t) => Math.sin((i/(c-1||1)+j/(r-1||1))*Math.PI*2+t)*0.5+0.5,
  scan: (i,j,c,r,t) => Math.sin(i/(c-1||1)*Math.PI*2+t)*0.5+0.5,
  pulse: (i,j,c,r,t) => { const cx=(c-1)/2,cy=(r-1)/2,d=Math.sqrt((i-cx)**2+(j-cy)**2),m=Math.sqrt(cx**2+cy**2)||1; return Math.sin(d/m*Math.PI*2-t*2)*0.5+0.5; },
  random: (i,j,c,r,t,pm) => { const k=i+'-'+j; if(!pm[k]) pm[k]=Math.random()*Math.PI*2; return Math.sin(t+pm[k])*0.5+0.5; },
  ripple: (i,j,c,r,t) => { const cx=(c-1)/2,cy=(r-1)/2,d=Math.sqrt((i-cx)**2+(j-cy)**2); return Math.sin(d*0.8-t*3)*Math.exp(-d*0.15)*0.5+0.5; },
  checkerboard: (i,j,c,r,t) => Math.sin(t+((i+j)%2===0?0:Math.PI))*0.5+0.5,
  typing: (i,j,c,r,t) => { const idx=i+j*c,p=(t*0.5)%(c*r+4),d=p-idx; if(d>0&&d<1) return d; if(d>=1&&d<3) return 1; if(d>=3&&d<4) return 4-d; return 0.15; },
  waterfall: (i,j,c,r,t) => { const rp=(t*0.8)%(r+2),d=rp-j; if(d>0&&d<0.5) return d*2; if(d>=0.5&&d<1.5) return 1; if(d>=1.5&&d<2) return (2-d)*2; return 0.1; },
  matrix: (i,j,c,r,t) => { const cx=(c-1)/2,cy=(r-1)/2; if(i===Math.floor(cx)&&j===Math.floor(cy)) return Math.sin(t*2)*0.3+0.7; const a=Math.atan2(j-cy,i-cx),sa=(t*0.5)%(Math.PI*2); return Math.max(0,1-Math.abs(((a-sa+Math.PI*3)%(Math.PI*2))-Math.PI)*2)*0.8+0.1; },
  breathe: (i,j,c,r,t) => (Math.sin(t+i*0.3+j*0.3)+1)/2,
  orbit: (i,j,c,r,t) => { const cx=(c-1)/2,cy=(r-1)/2,a=Math.atan2(j-cy,i-cx),d=Math.sqrt((i-cx)**2+(j-cy)**2); return (Math.sin(a*3+t-d*0.5)+1)/2; }
};

function drawRoundedRect(ctx,x,y,w,h,r) { const rad=Math.min(r,w/2,h/2); ctx.beginPath(); ctx.moveTo(x+rad,y); ctx.lineTo(x+w-rad,y); ctx.quadraticCurveTo(x+w,y,x+w,y+rad); ctx.lineTo(x+w,y+h-rad); ctx.quadraticCurveTo(x+w,y+h,x+w-rad,y+h); ctx.lineTo(x+rad,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-rad); ctx.lineTo(x,y+rad); ctx.quadraticCurveTo(x,y,x+rad,y); ctx.closePath(); }
function drawDiamond(ctx,x,y,w,h) { const cx=x+w/2,cy=y+h/2; ctx.beginPath(); ctx.moveTo(cx,y); ctx.lineTo(x+w,cy); ctx.lineTo(cx,y+h); ctx.lineTo(x,cy); ctx.closePath(); }

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;
canvas.width = ${w} * dpr; canvas.height = ${h} * dpr;
canvas.style.width = '${w}px'; canvas.style.height = '${h}px';
ctx.scale(dpr, dpr);

const phaseMap = {};
let time = 0;
let particles = null;

if (['particles','network'].includes(config.layout)) {
  const count = config.particleCount || (config.layout === 'network' ? 20 : 30);
  particles = Array.from({length: count}, () => ({
    x: Math.random()*${w}, y: Math.random()*${h},
    vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2,
    phase: Math.random()*Math.PI*2, size: 3+Math.random()*3
  }));
}

function animate() {
  time += config.speed * 0.02;
  const w = ${w}, h = ${h};
  const { layout, shape, color, glowColor, glowIntensity, bgContrast, easing, pattern, phaseDelay, cols, rows, gap, cellSize, aspectRatio, cornerRadius, rotation, glitchIntensity, colorOpacity, glowOpacity, pageBgVisible, colorVisible, glowVisible } = config;
  const cOp = colorVisible === false ? 0 : (colorOpacity ?? 100) / 100;
  const gOp = glowVisible === false ? 0 : (glowOpacity ?? 100) / 100;
  const easingFn = EASINGS[easing] || EASINGS.linear;
  const patternFn = PATTERNS[pattern] || PATTERNS.wave;
  const r = parseInt(color.slice(1,3),16), g = parseInt(color.slice(3,5),16), b = parseInt(color.slice(5,7),16);
  const gr = parseInt((glowColor||color).slice(1,3),16), gg = parseInt((glowColor||color).slice(3,5),16), gb = parseInt((glowColor||color).slice(5,7),16);

  ctx.clearRect(0,0,w,h);
  if (pageBgVisible !== false) { const bgL = Math.floor(255*(1-bgContrast/100)); ctx.fillStyle = 'rgba('+bgL*0.06+','+bgL*0.08+','+bgL*0.1+',0.3)'; ctx.fillRect(0,0,w,h); }

  if (layout === 'particles' || layout === 'network') {
    particles.forEach(p => { p.vx+=(Math.random()-0.5)*0.2; p.vy+=(Math.random()-0.5)*0.2; p.vx*=0.98; p.vy*=0.98; p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1; });
    if (layout === 'network') {
      const dist = config.connectionDist || 80;
      for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++) { const d=Math.sqrt((particles[i].x-particles[j].x)**2+(particles[i].y-particles[j].y)**2); if(d<dist){ ctx.strokeStyle='rgba('+r+','+g+','+b+','+(1-d/dist)*0.5*cOp+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke(); }}
    }
    particles.forEach(p => { const val=(Math.sin(time*2+p.phase)+1)/2; ctx.save(); if(glowIntensity>0){ctx.shadowColor='rgba('+gr+','+gg+','+gb+','+gOp+')'; ctx.shadowBlur=glowIntensity*(layout==='network'?0.8:val*2);} ctx.fillStyle='rgba('+r+','+g+','+b+','+((layout==='network'?0.5+val*0.5:0.2+val*0.8)*cOp)+')'; ctx.beginPath(); ctx.arc(p.x,p.y,p.size*(layout==='network'?0.7:0.5+val*0.5),0,Math.PI*2); ctx.fill(); ctx.restore(); });
    requestAnimationFrame(animate); return;
  }
  if (layout === 'matrix') {
    const charSet = '01{}[]()<>=>!==&&||+-*/%#@$_.:;?^~const let var if else for while return function class import export async await';
    const fontSize = Math.max(8, Math.min(w,h)/Math.max(cols,rows)*0.6);
    ctx.font = fontSize+"px 'JetBrains Mono', monospace"; ctx.textAlign='center'; ctx.textBaseline='middle';
    const cw=w/cols, ch=h/rows;
    for(let i=0;i<cols;i++) for(let j=0;j<rows;j++) { let rv=patternFn(i,j,cols,rows,time+phaseDelay*(i+j),phaseMap); const val=easingFn(Math.max(0,Math.min(1,rv))); ctx.save(); if(glowIntensity>0){ctx.shadowColor='rgba('+gr+','+gg+','+gb+','+gOp+')'; ctx.shadowBlur=glowIntensity*val*2;} ctx.fillStyle='rgba('+r+','+g+','+b+','+(0.05+val*0.95)*cOp+')'; ctx.fillText(charSet[Math.floor((time*3+i*7+j*13)%charSet.length)],cw*i+cw/2,ch*j+ch/2); ctx.restore(); }
    requestAnimationFrame(animate); return;
  }
  // grid
  const totalGapX=(cols-1)*gap, totalGapY=(rows-1)*gap;
  const baseCellW=((w-totalGapX)/cols)*(cellSize/100), baseCellH=((h-totalGapY)/rows)*(cellSize/100);
  let cellW=aspectRatio>=1?baseCellW*Math.min(aspectRatio,3):baseCellW, cellH=aspectRatio<1?baseCellH/Math.max(aspectRatio,0.2):baseCellH;
  cellW=Math.min(cellW,baseCellW*1.5); cellH=Math.min(cellH,baseCellH*1.5);
  const offX=(w-(baseCellW*cols+totalGapX))/2+(baseCellW-cellW)/2, offY=(h-(baseCellH*rows+totalGapY))/2+(baseCellH-cellH)/2;
  for(let i=0;i<cols;i++) for(let j=0;j<rows;j++) {
    let rv=patternFn(i,j,cols,rows,time+phaseDelay*(i+j),phaseMap);
    if(glitchIntensity>0&&Math.random()<glitchIntensity*0.05) rv=Math.random();
    const ev=easingFn(Math.max(0,Math.min(1,rv))); const x=offX+i*(baseCellW+gap), y=offY+j*(baseCellH+gap);
    ctx.save();
    if(rotation!==0){const cx=x+cellW/2,cy=y+cellH/2; ctx.translate(cx,cy); ctx.rotate(rotation*Math.PI/180); ctx.translate(-cx,-cy);}
    if(glowIntensity>0){ctx.shadowColor='rgba('+gr+','+gg+','+gb+','+gOp+')'; ctx.shadowBlur=glowIntensity*ev*3;}
    ctx.fillStyle='rgba('+r+','+g+','+b+','+(0.15+ev*0.85)*cOp+')';
    const rad=(cornerRadius/100)*Math.min(cellW,cellH)/2;
    if(shape==='rect'){drawRoundedRect(ctx,x,y,cellW,cellH,rad*2); ctx.fill();}
    else if(shape==='circle'){ctx.beginPath(); ctx.arc(x+cellW/2,y+cellH/2,Math.min(cellW,cellH)/2,0,Math.PI*2); ctx.fill();}
    else if(shape==='square'){ctx.fillRect(x,y,cellW,cellH);}
    else if(shape==='diamond'){drawDiamond(ctx,x,y,cellW,cellH); ctx.fill();}
    ctx.restore();
  }
  requestAnimationFrame(animate);
}
animate();
<\/script>
</body>
</html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedPage.name || 'loader'}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const updatePageSize = (id, w, h) => {
        setPages(prev => prev.map(p =>
            p.id === id ? { ...p, width: Math.max(30, w), height: Math.max(30, h) } : p
        ));
    };

    const startResize = (e, pageId, handle) => {
        e.stopPropagation();
        e.preventDefault();
        const page = pages.find(p => p.id === pageId);
        if (!page) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const cp = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
        setResizing({ pageId, handle, startX: cp.x, startY: cp.y, initX: page.x, initY: page.y, initW: page.width, initH: page.height });
    };

    // ---- 鼠标事件 ----
    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const canvasPos = screenToCanvas(sx, sy);

        if (e.button === 1 || (e.button === 0 && activeTool === 'hand')) {
            setIsPanning(true);
            setPanStart({ x: e.clientX, y: e.clientY });
            setViewStart({ x: viewState.x, y: viewState.y });
            return;
        }

        if (activeTool === 'frame') {
            setIsDrawing(true);
            setDrawStart(canvasPos);
            setDrawPreview({ x: canvasPos.x, y: canvasPos.y, width: 0, height: 0 });
            return;
        }

        if (!e.target.closest('.shape-element') && !e.target.closest('.float-bar')) {
            setSelectedPageId(null);
        }
    };

    const handleMouseMove = (e) => {
        if (isPanning) {
            const dx = e.clientX - panStart.x;
            const dy = e.clientY - panStart.y;
            setViewState(prev => ({ ...prev, x: viewStart.x + dx, y: viewStart.y + dy }));
            return;
        }
        if (resizing) {
            const rect = canvasRef.current.getBoundingClientRect();
            const cp = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
            const dx = cp.x - resizing.startX;
            const dy = cp.y - resizing.startY;
            let newX = resizing.initX, newY = resizing.initY, newW = resizing.initW, newH = resizing.initH;
            if (resizing.handle.includes('e')) newW = resizing.initW + dx;
            if (resizing.handle.includes('w')) { newW = resizing.initW - dx; newX = resizing.initX + dx; }
            if (resizing.handle.includes('s')) newH = resizing.initH + dy;
            if (resizing.handle.includes('n')) { newH = resizing.initH - dy; newY = resizing.initY + dy; }
            if (e.shiftKey) {
                const ratio = resizing.initW / resizing.initH;
                newH = newW / ratio;
                if (resizing.handle.includes('n')) newY = resizing.initY + resizing.initH - newH;
            }
            if (newW < 30) { newW = 30; if (resizing.handle.includes('w')) newX = resizing.initX + resizing.initW - 30; }
            if (newH < 30) { newH = 30; if (resizing.handle.includes('n')) newY = resizing.initY + resizing.initH - 30; }
            setPages(prev => prev.map(p =>
                p.id === resizing.pageId ? { ...p, x: newX, y: newY, width: Math.round(newW), height: Math.round(newH) } : p
            ));
            return;
        }
        if (draggingPageId) {
            const rect = canvasRef.current.getBoundingClientRect();
            const canvasPos = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
            setPages(prev => prev.map(p =>
                p.id === draggingPageId ? { ...p, x: canvasPos.x - dragOffset.x, y: canvasPos.y - dragOffset.y } : p
            ));
            return;
        }
        if (isDrawing && drawPreview) {
            const rect = canvasRef.current.getBoundingClientRect();
            const current = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
            let w = Math.abs(current.x - drawStart.x);
            let h = Math.abs(current.y - drawStart.y);
            if (e.shiftKey) {
                const size = Math.max(w, h);
                w = size;
                h = size;
            }
            setDrawPreview({
                x: current.x < drawStart.x ? drawStart.x - w : drawStart.x,
                y: current.y < drawStart.y ? drawStart.y - h : drawStart.y,
                width: w,
                height: h
            });
        }
    };

    const handleMouseUp = () => {
        if (isPanning) { setIsPanning(false); return; }
        if (resizing) { setResizing(null); return; }
        if (draggingPageId) { setDraggingPageId(null); return; }
        if (isDrawing && drawPreview) {
            const { x, y, width, height } = drawPreview;
            if (width > 20 && height > 20) {
                const newId = `page${Date.now()}`;
                setPages(prev => [...prev, {
                    id: newId,
                    name: `页面 ${prev.length + 1}`,
                    x, y, width, height,
                    config: { ...EMPTY_CONFIG },
                    isPlaying: false
                }]);
                setSelectedPageId(newId);
                setActiveTool('move');
            }
            setIsDrawing(false);
            setDrawPreview(null);
        }
    };

    // ---- 触摸事件（双指同时平移+缩放，单指无操作避免误触） ----
    const handleTouchStart = useCallback((e) => {
        const touches = e.touches;
        if (touches.length === 2) {
            e.preventDefault();
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const rect = canvasRef.current.getBoundingClientRect();
            const midX = (touches[0].clientX + touches[1].clientX) / 2 - rect.left;
            const midY = (touches[0].clientY + touches[1].clientY) / 2 - rect.top;
            const vs = viewStateRef.current;
            touchRef.current = {
                startDist: dist, startZoom: vs.zoom,
                startMidX: midX, startMidY: midY,
                startViewX: vs.x, startViewY: vs.y,
                active: true
            };
        }
    }, []);

    const handleTouchMove = useCallback((e) => {
        const touches = e.touches;
        if (touches.length === 2 && touchRef.current.active) {
            e.preventDefault();
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const rect = canvasRef.current.getBoundingClientRect();
            const curMidX = (touches[0].clientX + touches[1].clientX) / 2 - rect.left;
            const curMidY = (touches[0].clientY + touches[1].clientY) / 2 - rect.top;

            const scale = dist / touchRef.current.startDist;
            const newZoom = clamp(touchRef.current.startZoom * scale, 0.1, 5);
            const scaleRatio = newZoom / touchRef.current.startZoom;

            const panDx = curMidX - touchRef.current.startMidX;
            const panDy = curMidY - touchRef.current.startMidY;

            const zoomedX = touchRef.current.startMidX - (touchRef.current.startMidX - touchRef.current.startViewX) * scaleRatio;
            const zoomedY = touchRef.current.startMidY - (touchRef.current.startMidY - touchRef.current.startViewY) * scaleRatio;

            setViewState({ x: zoomedX + panDx, y: zoomedY + panDy, zoom: newZoom });
        }
    }, []);

    const handleTouchEnd = useCallback((e) => {
        if (e.touches.length < 2) {
            touchRef.current.active = false;
        }
    }, []);

    // ---- 滚轮/触控板事件（Figma 风格） ----
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const zoomIntensity = -e.deltaY * 0.01;
            setViewState(prev => {
                const newZoom = clamp(prev.zoom * (1 + zoomIntensity), 0.1, 5);
                const scaleRatio = newZoom / prev.zoom;
                return { x: mouseX - (mouseX - prev.x) * scaleRatio, y: mouseY - (mouseY - prev.y) * scaleRatio, zoom: newZoom };
            });
        } else {
            setViewState(prev => ({
                ...prev,
                x: prev.x - e.deltaX,
                y: prev.y - e.deltaY
            }));
        }
    }, []);

    // ---- 注册原生事件监听 ----
    useEffect(() => {
        const el = canvasRef.current;
        if (!el) return;
        el.addEventListener('wheel', handleWheel, { passive: false });
        el.addEventListener('touchstart', handleTouchStart, { passive: false });
        el.addEventListener('touchmove', handleTouchMove, { passive: false });
        el.addEventListener('touchend', handleTouchEnd);
        return () => {
            el.removeEventListener('wheel', handleWheel);
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchmove', handleTouchMove);
            el.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

    const spacePlayRef = useRef(false);

    // ---- 键盘快捷键 ----
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT') return;
            if (e.key === ' ' && !e.repeat) {
                e.preventDefault();
                setPages(prev => {
                    if (prev.length === 1) return prev.map(p => ({ ...p, isPlaying: !p.isPlaying }));
                    if (selectedPageId) return prev.map(p => p.id === selectedPageId ? { ...p, isPlaying: !p.isPlaying } : p);
                    return prev;
                });
            }
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPageId) deletePage(selectedPageId);
            if (e.key === 'v' || e.key === 'V') setActiveTool('move');
            if (e.key === 'f' || e.key === 'F') setActiveTool('frame');
            if (e.key === 'Escape') { setActiveTool('move'); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => { window.removeEventListener('keydown', handleKeyDown); };
    }, [activeTool, selectedPageId]);


    return (
        <div className="app-layout">
            {/* ====== 顶部栏 ====== */}
            <div className="top-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg, #3A68FF, #6B8FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    {editingCanvasName ? (
                        <input
                            autoFocus
                            className="page-name-edit"
                            style={{ width: 160, fontSize: 13, fontWeight: 600 }}
                            value={canvasName}
                            onChange={(e) => setCanvasName(e.target.value)}
                            onBlur={() => setEditingCanvasName(false)}
                            onKeyDown={(e) => { if (e.key === 'Enter') setEditingCanvasName(false); }}
                        />
                    ) : (
                        <span
                            style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '2px 6px', borderRadius: 4, transition: 'background 0.15s' }}
                            onDoubleClick={() => setEditingCanvasName(true)}
                            title="双击重命名画布"
                            onMouseEnter={(e) => e.target.style.background = '#262626'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            {canvasName}
                        </span>
                    )}
                </div>
                <div style={{ width: 1, height: 16, background: '#2a2a2a' }} />
                <span style={{ fontSize: 11, color: '#525252' }}>
                    {pages.length} 个页面
                </span>
                <div style={{ flex: 1 }} />
                <button className="btn-icon" onClick={saveProject} title="保存项目">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
                        <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/>
                        <path d="M7 3v4a1 1 0 0 0 1 1h7"/>
                    </svg>
                </button>
                <button className="btn-icon" onClick={() => document.getElementById('load-file-input').click()} title="打开项目">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 14l1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
                <input id="load-file-input" type="file" accept=".glow,.json" style={{ display: 'none' }}
                    onChange={e => { if (e.target.files[0]) loadProjectFile(e.target.files[0]); e.target.value = ''; }} />
            </div>

            {/* ====== 页面面板 ====== */}
            <div className="pages-panel custom-scroll">
                <div className="panel-header">
                    <span className="panel-title">页面</span>
                    <button className="btn-icon" onClick={addPage} title="新建页面">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                </div>
                <div style={{ padding: '6px 0', overflowY: 'auto', flex: 1 }}>
                    {pages.map(page => (
                        <div
                            key={page.id}
                            className={`page-item ${selectedPageId === page.id ? 'active' : ''}`}
                            onClick={() => setSelectedPageId(page.id)}
                        >
                            <div className="page-thumb">
                                <div style={{ width: '100%', height: '100%', padding: 2 }}>
                                    <div style={{ width: '100%', height: '100%', background: page.config.color, borderRadius: 2, opacity: 0.6 }} />
                                </div>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                {editingPageId === page.id ? (
                                    <input
                                        autoFocus
                                        className="page-name-edit"
                                        value={page.name}
                                        onChange={(e) => renamePage(page.id, e.target.value)}
                                        onBlur={() => setEditingPageId(null)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') setEditingPageId(null); }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <div
                                        style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        onDoubleClick={(e) => { e.stopPropagation(); setEditingPageId(page.id); }}
                                        title="双击重命名"
                                    >
                                        {page.name}
                                    </div>
                                )}
                            </div>
                            <button
                                className="btn-icon page-delete-btn"
                                style={{ width: 22, height: 22, flexShrink: 0, opacity: 0, transition: 'opacity 0.15s' }}
                                onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
                                title="删除页面"
                            >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                    ))}
                    {pages.length === 0 && (
                        <div style={{ padding: '20px 12px', textAlign: 'center', color: '#525252', fontSize: 11 }}>
                            点击 + 或在画布上绘制来添加页面
                        </div>
                    )}
                </div>
            </div>

            {/* ====== 画布区域 ====== */}
            <div
                ref={canvasRef}
                className={`canvas-area ${isPanning || draggingPageId ? 'panning' : ''} ${activeTool === 'frame' ? 'ready-to-draw' : ''}`}
                style={canvasBgStyle}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div
                    style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundImage: 'linear-gradient(rgba(61,61,61,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(61,61,61,0.3) 1px, transparent 1px)',
                        backgroundSize: `${40 * viewState.zoom}px ${40 * viewState.zoom}px`,
                        backgroundPosition: `${viewState.x % (40 * viewState.zoom)}px ${viewState.y % (40 * viewState.zoom)}px`,
                        pointerEvents: 'none'
                    }}
                />
                <div
                    className="canvas-viewport"
                    style={{ transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.zoom})` }}
                >
                    {pages.map(page => (
                        <div
                            key={page.id}
                            data-page-id={page.id}
                            className={`shape-element ${selectedPageId === page.id ? 'selected' : ''}`}
                            style={{
                                left: page.x, top: page.y,
                                width: page.width, height: page.height,
                                borderRadius: '8px',
                                backgroundColor: (() => {
                                    if (page.config.pageBgVisible === false) return 'transparent';
                                    const hex = (page.config.pageBg || '#0a0a0a').replace('#', '');
                                    const r = parseInt(hex.substring(0, 2), 16) || 0;
                                    const g = parseInt(hex.substring(2, 4), 16) || 0;
                                    const b = parseInt(hex.substring(4, 6), 16) || 0;
                                    const a = (page.config.pageBgOpacity ?? 100) / 100;
                                    return `rgba(${r},${g},${b},${a})`;
                                })(),
                            }}
                            onMouseDown={(e) => {
                                if (activeTool === 'move') {
                                    e.stopPropagation();
                                    setSelectedPageId(page.id);
                                    const rect = canvasRef.current.getBoundingClientRect();
                                    const cp = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
                                    setDraggingPageId(page.id);
                                    setDragOffset({ x: cp.x - page.x, y: cp.y - page.y });
                                }
                            }}
                        >
                            <div style={{ position: 'absolute', top: -28, left: 0, fontSize: 11, color: '#737373', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span>{page.name}</span>
                                <div
                                    style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: page.isPlaying ? '#3A68FF' : '#737373', background: page.isPlaying ? 'rgba(58,104,255,0.15)' : 'transparent', transition: 'all 0.15s' }}
                                    onMouseDown={(e) => { e.stopPropagation(); togglePagePlay(page.id); }}
                                >
                                    {page.isPlaying ? (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                                    ) : (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                    )}
                                </div>
                            </div>
                            <LoaderRenderer config={page.config} width={page.width} height={page.height} isPlaying={page.isPlaying} />
                            {selectedPageId === page.id && (
                                <>
                                    <div className="resize-handle nw" onMouseDown={(e) => startResize(e, page.id, 'nw')} />
                                    <div className="resize-handle ne" onMouseDown={(e) => startResize(e, page.id, 'ne')} />
                                    <div className="resize-handle sw" onMouseDown={(e) => startResize(e, page.id, 'sw')} />
                                    <div className="resize-handle se" onMouseDown={(e) => startResize(e, page.id, 'se')} />
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {drawPreview && (
                    <div
                        className="draw-preview"
                        style={{
                            left: drawPreview.x * viewState.zoom + viewState.x,
                            top: drawPreview.y * viewState.zoom + viewState.y,
                            width: drawPreview.width * viewState.zoom,
                            height: drawPreview.height * viewState.zoom,
                        }}
                    />
                )}

                <div className="zoom-indicator">{Math.round(viewState.zoom * 100)}%</div>

                {pages.length === 0 && !isDrawing && (
                    <div className="empty-canvas">
                        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>⊞</div>
                        <div style={{ fontSize: 14, marginBottom: 8 }}>点击下方 + 新建页面</div>
                        <div style={{ fontSize: 12, color: '#404040' }}>
                            F 新建 · V 移动 · Space 播放 · 双指缩放/平移
                        </div>
                    </div>
                )}

                <div className="float-bar">
                    <button
                        className={`float-btn ${activeTool === 'move' ? 'active' : ''}`}
                        onClick={() => setActiveTool('move')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
                        <span className="ftip">移动 (V)</span>
                    </button>
                    <button
                        className={`float-btn ${activeTool === 'frame' ? 'active' : ''}`}
                        onClick={() => setActiveTool(activeTool === 'frame' ? 'move' : 'frame')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
                        <span className="ftip">新建页面 (F)</span>
                    </button>
                    <button
                        className="float-btn"
                        onClick={addPage}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                        <span className="ftip">快速添加页面</span>
                    </button>
                </div>
            </div>

            {/* ====== 右侧属性面板 ====== */}
            <div className="right-panel custom-scroll">
                {selectedPage ? (
                    <>
                        <div style={{ display: 'flex', borderBottom: '1px solid #2a2a2a' }}>
                            {['design', 'animate'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setRightTab(tab)}
                                    style={{
                                        flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
                                        color: rightTab === tab ? '#e5e5e5' : '#525252', fontSize: 12, fontWeight: 500,
                                        cursor: 'pointer', borderBottom: rightTab === tab ? '2px solid #3A68FF' : '2px solid transparent',
                                        transition: 'all 0.15s', fontFamily: 'inherit'
                                    }}
                                >
                                    {tab === 'design' ? '设计' : '动画'}
                                </button>
                            ))}
                        </div>

                        {rightTab === 'design' && (
                            <>
                                <div className="prop-section">
                                    <div className="prop-label">尺寸</div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>W</div>
                                            <DragInput value={selectedPage.width} min={30} onChange={v => updatePageSize(selectedPage.id, v, selectedPage.height)} className="input-field" style={{ width: '100%' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>H</div>
                                            <DragInput value={selectedPage.height} min={30} onChange={v => updatePageSize(selectedPage.id, selectedPage.width, v)} className="input-field" style={{ width: '100%' }} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 1 }}>
                                            <span style={{ fontSize: 10, color: '#404040' }}>px</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="prop-section">
                                    <div className="prop-label">布局</div>
                                    <div className="segmented-control">
                                        {['grid', 'matrix', 'particles', 'network', 'ring', 'spiral'].map(l => (
                                            <button key={l} className={`segmented-btn ${config.layout === l ? 'active' : ''}`} onClick={() => updatePageConfig({ ...config, layout: l })}>{CN[l]}</button>
                                        ))}
                                    </div>
                                </div>

                                {config.layout !== 'matrix' && (
                                    <div className="prop-section">
                                        <div className="prop-label">形状</div>
                                        <div className="segmented-control">
                                            {['rect', 'circle', 'square', 'diamond'].map(s => (
                                                <button key={s} className={`segmented-btn ${config.shape === s ? 'active' : ''}`} onClick={() => updatePageConfig({ ...config, shape: s })}>{CN[s]}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="prop-section">
                                    <div className="prop-label">网格参数</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        {(config.layout === 'grid' || config.layout === 'matrix' || config.layout === 'ring') && (
                                            <>
                                                <div>
                                                    <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>横排数</div>
                                                    <DragInput value={config.cols} min={1} max={30} onChange={v => updatePageConfig({ ...config, cols: v })} className="input-field" />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>竖排数</div>
                                                    <DragInput value={config.rows} min={1} max={30} onChange={v => updatePageConfig({ ...config, rows: v })} className="input-field" />
                                                </div>
                                            </>
                                        )}
                                        {(config.layout === 'grid' || config.layout === 'matrix') && (
                                            <>
                                                <div>
                                                    <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>间距 (px)</div>
                                                    <DragInput value={config.gap} min={0} max={30} onChange={v => updatePageConfig({ ...config, gap: v })} className="input-field" />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>单元格 (%)</div>
                                                    <DragInput value={config.cellSize} min={10} max={100} onChange={v => updatePageConfig({ ...config, cellSize: v })} className="input-field" />
                                                </div>
                                            </>
                                        )}
                                        {(config.layout === 'particles' || config.layout === 'network' || config.layout === 'spiral') && (
                                            <div>
                                                <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>粒子数量</div>
                                                <DragInput value={config.particleCount} min={5} max={100} onChange={v => updatePageConfig({ ...config, particleCount: v })} className="input-field" />
                                            </div>
                                        )}
                                        {config.layout === 'network' && (
                                            <div>
                                                <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>连接距离</div>
                                                <DragInput value={config.connectionDist} min={30} max={200} onChange={v => updatePageConfig({ ...config, connectionDist: v })} className="input-field" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="prop-section">
                                    <div className="prop-label">形态</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <div>
                                            <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>圆角 (px)</div>
                                            <DragInput value={config.cornerRadius} min={0} max={100} onChange={v => updatePageConfig({ ...config, cornerRadius: v })} className="input-field" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>旋转 (°)</div>
                                            <DragInput value={config.rotation} min={0} max={360} onChange={v => updatePageConfig({ ...config, rotation: v })} className="input-field" />
                                        </div>
                                    </div>
                                </div>

                                <div className="prop-section">
                                    <div className="prop-label">填充</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <label style={{
                                            width: 22, height: 22, borderRadius: 4,
                                            backgroundColor: (config.pageBgVisible !== false) ? (config.pageBg || '#0a0a0a') : '#333',
                                            border: '1px solid #444', cursor: 'pointer', flexShrink: 0,
                                            display: 'block', position: 'relative',
                                            opacity: (config.pageBgVisible !== false) ? 1 : 0.4
                                        }}>
                                            <input type="color" value={config.pageBg || '#0a0a0a'}
                                                onChange={e => updatePageConfig({ ...config, pageBg: e.target.value })}
                                                style={{ position: 'absolute', width: 0, height: 0, opacity: 0, border: 'none', padding: 0 }} />
                                        </label>
                                        <input type="text" value={(config.pageBg || '#0a0a0a').replace('#', '').toUpperCase()}
                                            onChange={e => { const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6); if (v.length === 6) updatePageConfig({ ...config, pageBg: '#' + v }); }}
                                            style={{ flex: 1, minWidth: 0, background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: 4, color: '#ccc', padding: '4px 8px', fontSize: 12, fontFamily: 'monospace' }} />
                                        <DragInput value={config.pageBgOpacity ?? 100} min={0} max={100}
                                            onChange={v => updatePageConfig({ ...config, pageBgOpacity: v })}
                                            style={{ width: 36, padding: '4px 4px', textAlign: 'center', flexShrink: 0 }} suffix="%" />
                                        <div
                                            onClick={() => updatePageConfig({ ...config, pageBgVisible: !(config.pageBgVisible !== false) })}
                                            style={{
                                                cursor: 'pointer',
                                                width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                borderRadius: 4, flexShrink: 0
                                            }}
                                            title={(config.pageBgVisible !== false) ? '隐藏填充' : '显示填充'}
                                        >
                                            {(config.pageBgVisible !== false) ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            ) : (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
                                                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                                                    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
                                                    <path d="m2 2 20 20"/>
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="prop-section">
                                    <div className="prop-label">颜色</div>
                                    <div style={{ fontSize: 10, color: '#525252', marginBottom: 5 }}>主题色</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                        <label style={{
                                            width: 22, height: 22, borderRadius: 4,
                                            backgroundColor: (config.colorVisible !== false) ? config.color : '#333',
                                            border: '1px solid #444', cursor: 'pointer', flexShrink: 0,
                                            display: 'block', position: 'relative',
                                            opacity: (config.colorVisible !== false) ? 1 : 0.4
                                        }}>
                                            <input type="color" value={config.color} onChange={e => updatePageConfig({ ...config, color: e.target.value })}
                                                style={{ position: 'absolute', width: 0, height: 0, opacity: 0, border: 'none', padding: 0 }} />
                                        </label>
                                        <input type="text" value={config.color.replace('#', '').toUpperCase()}
                                            onChange={e => { const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6); if (v.length === 6) updatePageConfig({ ...config, color: '#' + v }); }}
                                            style={{ flex: 1, minWidth: 0, background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: 4, color: '#ccc', padding: '4px 8px', fontSize: 12, fontFamily: 'monospace' }} />
                                        <DragInput value={config.colorOpacity ?? 100} min={0} max={100}
                                            onChange={v => updatePageConfig({ ...config, colorOpacity: v })}
                                            style={{ width: 36, padding: '4px 4px', textAlign: 'center', flexShrink: 0 }} suffix="%" />
                                        <div onClick={() => updatePageConfig({ ...config, colorVisible: !(config.colorVisible !== false) })}
                                            style={{ cursor: 'pointer', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, flexShrink: 0 }}
                                            title={(config.colorVisible !== false) ? '隐藏主题色' : '显示主题色'}>
                                            {(config.colorVisible !== false) ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                            ) : (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 10, color: '#525252', marginBottom: 5 }}>发光色</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <label style={{
                                            width: 22, height: 22, borderRadius: 4,
                                            backgroundColor: (config.glowVisible !== false) ? (config.glowColor || config.color) : '#333',
                                            border: '1px solid #444', cursor: 'pointer', flexShrink: 0,
                                            display: 'block', position: 'relative',
                                            opacity: (config.glowVisible !== false) ? 1 : 0.4
                                        }}>
                                            <input type="color" value={config.glowColor || config.color} onChange={e => updatePageConfig({ ...config, glowColor: e.target.value })}
                                                style={{ position: 'absolute', width: 0, height: 0, opacity: 0, border: 'none', padding: 0 }} />
                                        </label>
                                        <input type="text" value={(config.glowColor || config.color).replace('#', '').toUpperCase()}
                                            onChange={e => { const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6); if (v.length === 6) updatePageConfig({ ...config, glowColor: '#' + v }); }}
                                            style={{ flex: 1, minWidth: 0, background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: 4, color: '#ccc', padding: '4px 8px', fontSize: 12, fontFamily: 'monospace' }} />
                                        <DragInput value={config.glowOpacity ?? 100} min={0} max={100}
                                            onChange={v => updatePageConfig({ ...config, glowOpacity: v })}
                                            style={{ width: 36, padding: '4px 4px', textAlign: 'center', flexShrink: 0 }} suffix="%" />
                                        <div onClick={() => updatePageConfig({ ...config, glowVisible: !(config.glowVisible !== false) })}
                                            style={{ cursor: 'pointer', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, flexShrink: 0 }}
                                            title={(config.glowVisible !== false) ? '隐藏发光色' : '显示发光色'}>
                                            {(config.glowVisible !== false) ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                            ) : (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="prop-section">
                                    <div className="prop-label">光效</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <div>
                                            <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>发光强度</div>
                                            <DragInput value={config.glowIntensity} min={0} max={100} onChange={v => updatePageConfig({ ...config, glowIntensity: v })} className="input-field" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>背景对比 (%)</div>
                                            <DragInput value={config.bgContrast} min={0} max={100} onChange={v => updatePageConfig({ ...config, bgContrast: v })} className="input-field" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>故障效果</div>
                                            <DragInput value={config.glitchIntensity} min={0} max={1} step={0.05} onChange={v => updatePageConfig({ ...config, glitchIntensity: v })} className="input-field" />
                                        </div>
                                    </div>
                                </div>

                                <div className="prop-section">
                                    <div className="prop-label">导出</div>
                                    <div style={{ display: 'flex', alignItems: 'center', height: 32, background: '#0a0a0a', borderRadius: 4, border: '1px solid #2a2a2a', padding: '0 4px 0 0' }}>
                                        {exportFormat === 'png' && (
                                            <select id="export-scale" defaultValue="1"
                                                style={{ background: 'transparent', border: 'none', color: '#e5e5e5', fontSize: 11, cursor: 'pointer', outline: 'none', width: 42, padding: '0 0 0 8px', flexShrink: 0 }}>
                                                <option value="0.5">0.5x</option>
                                                <option value="1">1x</option>
                                                <option value="2">2x</option>
                                                <option value="3">3x</option>
                                                <option value="4">4x</option>
                                            </select>
                                        )}
                                        {exportFormat === 'png' && <div style={{ width: 1, height: 16, background: '#2a2a2a', flexShrink: 0 }} />}
                                        <div style={{ flex: 1, fontSize: 11, color: '#737373', padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedPage.name}</div>
                                        <select value={exportFormat} onChange={e => setExportFormat(e.target.value)}
                                            style={{ background: 'transparent', border: 'none', color: '#e5e5e5', fontSize: 11, fontWeight: 500, cursor: 'pointer', outline: 'none', width: 52, padding: 0, flexShrink: 0, textAlign: 'right' }}>
                                            <option value="png">PNG</option>
                                            <option value="html">HTML</option>
                                        </select>
                                        <div style={{ width: 1, height: 16, background: '#2a2a2a', flexShrink: 0 }} />
                                        <div
                                            onClick={() => exportFormat === 'html' ? exportCode() : exportPNG(Number(document.getElementById('export-scale')?.value || 1))}
                                            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '0 4px 4px 0', transition: 'background 0.15s', flexShrink: 0 }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#262626'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            title={`导出 ${exportFormat.toUpperCase()}`}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 3v12M12 15l-4-4M12 15l4-4"/>
                                                <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {rightTab === 'animate' && (
                            <>
                                <div className="prop-section">
                                    <div className="prop-label">场景模板</div>
                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                        {AI_PRESETS.map((preset, idx) => (
                                            <button
                                                key={`p${idx}`}
                                                className="preset-tag"
                                                style={{ background: '#111', borderStyle: 'dashed' }}
                                                onClick={() => { applyPreset(preset); }}
                                                title={`${CN[preset.layout] || preset.layout} · ${CN[preset.pattern] || preset.pattern}`}
                                            >{preset.name}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="prop-section">
                                    <button className="ai-btn" onClick={randomizeAnimation}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/>
                                            <path d="m18 2 4 4-4 4"/>
                                            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/>
                                            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/>
                                            <path d="m18 14 4 4-4 4"/>
                                        </svg>
                                        随机动画
                                    </button>
                                </div>

                                <div className="prop-section">
                                    <div className="prop-label">动效</div>
                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                        {['wave', 'scan', 'pulse', 'random', 'ripple', 'checkerboard', 'typing', 'waterfall', 'matrix', 'breathe', 'orbit', 'zigzag', 'spiralScan', 'rain', 'heartbeat'].map(p => (
                                            <button key={p} className={`preset-tag ${config.pattern === p ? 'active' : ''}`} onClick={() => updatePageConfig({ ...config, pattern: p })}>{CN[p]}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="prop-section">
                                    <div className="prop-label">缓动曲线</div>
                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                        {['linear', 'sine', 'sineInOut', 'elastic', 'bounce', 'expo', 'back', 'cubic', 'quart', 'circ', 'steps'].map(e => (
                                            <button key={e} className={`preset-tag ${config.easing === e ? 'active' : ''}`} onClick={() => updatePageConfig({ ...config, easing: e })}>{CN[e]}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="prop-section">
                                    <div className="prop-label">参数</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <div>
                                            <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>速度 (x)</div>
                                            <DragInput value={config.speed} min={0.1} max={5} step={0.1} onChange={v => updatePageConfig({ ...config, speed: v })} className="input-field" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 10, color: '#525252', marginBottom: 4 }}>相位差</div>
                                            <DragInput value={config.phaseDelay} min={0} max={1} step={0.05} onChange={v => updatePageConfig({ ...config, phaseDelay: v })} className="input-field" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div style={{ padding: 0 }}>
                        <div style={{ padding: '12px 12px', borderBottom: '1px solid #2a2a2a', overflow: 'hidden' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0', marginBottom: 12 }}>页面</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                                <label style={{
                                        width: 22, height: 22, borderRadius: 4,
                                        backgroundColor: canvasBg.color,
                                        border: '1px solid #444', cursor: 'pointer', flexShrink: 0,
                                        display: 'block', position: 'relative'
                                    }}>
                                    <input
                                        type="color"
                                        value={canvasBg.color}
                                        onChange={e => setCanvasBg(prev => ({ ...prev, color: e.target.value }))}
                                        style={{ position: 'absolute', width: 0, height: 0, opacity: 0, border: 'none', padding: 0 }}
                                    />
                                </label>
                                <input
                                    type="text"
                                    value={canvasBg.color.replace('#', '').toUpperCase()}
                                    onChange={e => {
                                        const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                                        if (v.length <= 6) {
                                            const padded = v.padEnd(6, '0');
                                            setCanvasBg(prev => ({ ...prev, color: '#' + padded }));
                                        }
                                    }}
                                    style={{
                                        flex: 1, minWidth: 0, background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: 4,
                                        color: '#ccc', padding: '4px 8px', fontSize: 12, fontFamily: 'monospace'
                                    }}
                                />
                                <div
                                    onClick={() => setCanvasBg(prev => ({ ...prev, visible: !prev.visible }))}
                                    style={{
                                        cursor: 'pointer',
                                        width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: 4, flexShrink: 0
                                    }}
                                    title={canvasBg.visible ? '隐藏背景' : '显示背景'}
                                >
                                    {canvasBg.visible ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    ) : (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
                                            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                                            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
                                            <path d="m2 2 20 20"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: 40, textAlign: 'center', color: '#525252' }}>
                            <div style={{ fontSize: 40, marginBottom: 16 }}>◻</div>
                            <div style={{ fontSize: 13, marginBottom: 8 }}>选择一个页面开始编辑</div>
                            <div style={{ fontSize: 11 }}>或在画布上绘制新形状</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
