const CN = {
    wave: '波浪', scan: '扫描', pulse: '脉冲', random: '随机闪烁',
    ripple: '涟漪', checkerboard: '棋盘', typing: '打字机',
    waterfall: '瀑布流', matrix: '矩阵', breathe: '呼吸', orbit: '轨道',
    linear: '线性', sine: '正弦', sineInOut: '平滑正弦',
    elastic: '弹性', bounce: '弹跳', expo: '指数', back: '回弹',
    grid: '网格', particles: '粒子', network: '网络',
    rect: '圆角矩形', circle: '圆形', square: '矩形', diamond: '菱形',
    move: '移动', frame: '画框', rectangle: '矩形', ellipse: '椭圆',
    line: '线条', pen: '钢笔', text: '文字', hand: '抓手',
};

const EASINGS = {
    linear: t => t,
    sine: t => (Math.sin(t * Math.PI - Math.PI / 2) + 1) / 2,
    sineInOut: t => -(Math.cos(Math.PI * t) - 1) / 2,
    elastic: t => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1;
    },
    bounce: t => {
        const n1 = 7.5625, d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
        else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    },
    expo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    back: t => {
        const c1 = 1.70158, c3 = c1 + 1;
        return c3 * t * t * t - c1 * t * t;
    }
};

const PATTERNS = {
    wave: (i, j, cols, rows, time, phaseMap) => {
        const dx = i / (cols - 1 || 1);
        const dy = j / (rows - 1 || 1);
        return Math.sin((dx + dy) * Math.PI * 2 + time) * 0.5 + 0.5;
    },
    scan: (i, j, cols, rows, time) => {
        const dx = i / (cols - 1 || 1);
        return Math.sin(dx * Math.PI * 2 + time) * 0.5 + 0.5;
    },
    pulse: (i, j, cols, rows, time) => {
        const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
        const d = Math.sqrt((i - cx) ** 2 + (j - cy) ** 2);
        const maxD = Math.sqrt(cx ** 2 + cy ** 2) || 1;
        return Math.sin((d / maxD) * Math.PI * 2 - time * 2) * 0.5 + 0.5;
    },
    random: (i, j, cols, rows, time, phaseMap) => {
        const key = `${i}-${j}`;
        if (!phaseMap.current[key]) phaseMap.current[key] = Math.random() * Math.PI * 2;
        return Math.sin(time + phaseMap.current[key]) * 0.5 + 0.5;
    },
    diagonal: (i, j, cols, rows, time) => {
        return Math.sin((i + j) * 0.5 + time) * 0.5 + 0.5;
    },
    ripple: (i, j, cols, rows, time) => {
        const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
        const d = Math.sqrt((i - cx) ** 2 + (j - cy) ** 2);
        return Math.sin(d * 0.8 - time * 3) * Math.exp(-d * 0.15) * 0.5 + 0.5;
    },
    checkerboard: (i, j, cols, rows, time) => {
        const phase = (i + j) % 2 === 0 ? 0 : Math.PI;
        return Math.sin(time + phase) * 0.5 + 0.5;
    },
    typing: (i, j, cols, rows, time) => {
        const index = i + j * cols;
        const total = cols * rows;
        const progress = (time * 0.5) % (total + 4);
        const diff = progress - index;
        if (diff > 0 && diff < 1) return diff;
        if (diff >= 1 && diff < 3) return 1;
        if (diff >= 3 && diff < 4) return 4 - diff;
        return 0.15;
    },
    waterfall: (i, j, cols, rows, time) => {
        const rowProgress = (time * 0.8) % (rows + 2);
        const diff = rowProgress - j;
        if (diff > 0 && diff < 0.5) return diff * 2;
        if (diff >= 0.5 && diff < 1.5) return 1;
        if (diff >= 1.5 && diff < 2) return (2 - diff) * 2;
        if (Math.random() > 0.97) return Math.random() * 0.5 + 0.5;
        return 0.1;
    },
    matrix: (i, j, cols, rows, time) => {
        const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
        const d = Math.sqrt((i - cx) ** 2 + (j - cy) ** 2);
        const isCenter = i === Math.floor(cx) && j === Math.floor(cy);
        if (isCenter) return Math.sin(time * 2) * 0.3 + 0.7;
        const angle = Math.atan2(j - cy, i - cx);
        const scanAngle = (time * 0.5) % (Math.PI * 2);
        const angleDiff = Math.abs(((angle - scanAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        return Math.max(0, 1 - angleDiff * 2) * 0.8 + 0.1;
    },
    breathe: (i, j, cols, rows, time) => {
        return (Math.sin(time + i * 0.3 + j * 0.3) + 1) / 2;
    },
    orbit: (i, j, cols, rows, time) => {
        const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
        const angle = Math.atan2(j - cy, i - cx);
        const d = Math.sqrt((i-cx)**2 + (j-cy)**2);
        return (Math.sin(angle * 3 + time - d * 0.5) + 1) / 2;
    }
};

const EMPTY_CONFIG = {
    layout: 'grid',
    shape: 'rect',
    color: '#3A68FF',
    glowColor: '#6B8FFF',
    glowIntensity: 40,
    bgContrast: 95,
    speed: 1.0,
    easing: 'sineInOut',
    pattern: 'wave',
    phaseDelay: 0.2,
    cols: 4,
    rows: 4,
    gap: 8,
    cellSize: 70,
    aspectRatio: 1,
    cornerRadius: 20,
    rotation: 0,
    particleCount: 0,
    connectionDist: 0,
    glitchIntensity: 0,
    pageBg: '#0a0a0a',
    pageBgVisible: false,
    glowVisible: false
};

const AI_PRESETS = [
    { name: '思考中', layout: 'grid', pattern: 'wave', easing: 'sineInOut', speed: 0.6, color: '#3A68FF', shape: 'rect', cols: 3, rows: 3, gap: 8, cornerRadius: 30 },
    { name: '加载条', layout: 'grid', pattern: 'scan', easing: 'linear', speed: 2.0, color: '#06b6d4', shape: 'rect', cols: 8, rows: 1, gap: 6, cornerRadius: 50 },
    { name: '脉冲圆', layout: 'grid', pattern: 'pulse', easing: 'elastic', speed: 1.2, color: '#f59e0b', shape: 'circle', cols: 5, rows: 5, gap: 8 },
    { name: '成功涟漪', layout: 'grid', pattern: 'ripple', easing: 'bounce', speed: 1.0, color: '#22c55e', shape: 'circle', cols: 5, rows: 5, gap: 10 },
    { name: '警报闪烁', layout: 'grid', pattern: 'random', easing: 'linear', speed: 2.5, color: '#ef4444', shape: 'square', cols: 4, rows: 3, gap: 6, glitchIntensity: 0.4 },
    { name: '呼吸灯', layout: 'grid', pattern: 'breathe', easing: 'sine', speed: 0.5, color: '#3A68FF', shape: 'circle', cols: 1, rows: 1, gap: 0, cornerRadius: 0 },
    { name: '轨道环', layout: 'grid', pattern: 'orbit', easing: 'sineInOut', speed: 1.0, color: '#ec4899', shape: 'circle', cols: 8, rows: 8, gap: 4 },
    { name: '代码雨', layout: 'matrix', pattern: 'waterfall', easing: 'linear', speed: 1.8, color: '#22c55e', cols: 12, rows: 16, gap: 0 },
    { name: '矩阵风暴', layout: 'matrix', pattern: 'random', easing: 'expo', speed: 2.0, color: '#06b6d4', cols: 16, rows: 12, gap: 0, glitchIntensity: 0.5 },
    { name: '星空粒子', layout: 'particles', pattern: 'wave', easing: 'sine', speed: 0.8, color: '#e2e8f0', particleCount: 50 },
    { name: '萤火虫', layout: 'particles', pattern: 'random', easing: 'sineInOut', speed: 0.5, color: '#fbbf24', particleCount: 25 },
    { name: '神经网络', layout: 'network', pattern: 'wave', easing: 'sineInOut', speed: 1.0, color: '#6B8FFF', particleCount: 25, connectionDist: 100 },
    { name: '星座连线', layout: 'network', pattern: 'breathe', easing: 'sine', speed: 0.6, color: '#94a3b8', particleCount: 15, connectionDist: 120 },
    { name: '棋盘翻转', layout: 'grid', pattern: 'checkerboard', easing: 'back', speed: 1.5, color: '#6B8FFF', shape: 'square', cols: 6, rows: 6, gap: 4 },
    { name: '打字机', layout: 'grid', pattern: 'typing', easing: 'expo', speed: 1.2, color: '#34d399', shape: 'rect', cols: 10, rows: 1, gap: 6, cornerRadius: 50 },
    { name: '菱形波', layout: 'grid', pattern: 'wave', easing: 'elastic', speed: 0.8, color: '#fb923c', shape: 'diamond', cols: 5, rows: 5, gap: 10 },
];
