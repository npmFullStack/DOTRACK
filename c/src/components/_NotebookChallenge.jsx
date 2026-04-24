// src/components/_NotebookChallenge.jsx
import { motion } from "framer-motion";

const colorVariants = {
    lime: {
        cover: "#d9f99d",
        coverDark: "#a3e635",
        spine: "#bef264",
        spineAccent: "#a3e635",
        text: "#365314",
        textLight: "#4d7c0f",
        lineColor: "rgba(54,83,20,0.35)",
        spiralColor: "#86efac",
        holeColor: "#f7fee7",
        holeBorder: "#a3e635",
    },
    pink: {
        cover: "#fce7f3",
        coverDark: "#f9a8d4",
        spine: "#fbcfe8",
        spineAccent: "#f9a8d4",
        text: "#831843",
        textLight: "#9d174d",
        lineColor: "rgba(131,24,67,0.3)",
        spiralColor: "#f9a8d4",
        holeColor: "#fff1f2",
        holeBorder: "#f9a8d4",
    },
    yellow: {
        cover: "#fef9c3",
        coverDark: "#fde047",
        spine: "#fef08a",
        spineAccent: "#fde047",
        text: "#713f12",
        textLight: "#854d0e",
        lineColor: "rgba(113,63,18,0.3)",
        spiralColor: "#fde047",
        holeColor: "#fefce8",
        holeBorder: "#fde047",
    },
    sky: {
        cover: "#e0f2fe",
        coverDark: "#7dd3fc",
        spine: "#bae6fd",
        spineAccent: "#7dd3fc",
        text: "#0c4a6e",
        textLight: "#075985",
        lineColor: "rgba(12,74,110,0.3)",
        spiralColor: "#7dd3fc",
        holeColor: "#f0f9ff",
        holeBorder: "#7dd3fc",
    },
    orange: {
        cover: "#ffedd5",
        coverDark: "#fdba74",
        spine: "#fed7aa",
        spineAccent: "#fdba74",
        text: "#7c2d12",
        textLight: "#9a3412",
        lineColor: "rgba(124,45,18,0.3)",
        spiralColor: "#fdba74",
        holeColor: "#fff7ed",
        holeBorder: "#fdba74",
    },
    violet: {
        cover: "#ede9fe",
        coverDark: "#c4b5fd",
        spine: "#ddd6fe",
        spineAccent: "#c4b5fd",
        text: "#3b0764",
        textLight: "#4c1d95",
        lineColor: "rgba(59,7,100,0.3)",
        spiralColor: "#c4b5fd",
        holeColor: "#f5f3ff",
        holeBorder: "#c4b5fd",
    },
};

const colorKeys = ["lime", "pink", "yellow", "sky", "orange", "violet"];

const NotebookChallenge = ({
    title,
    tasks = [],
    duration = 0,
    completedTasks = 0,
    index = 0,
    onClick,
    className = "",
}) => {
    const colorKey = colorKeys[index % colorKeys.length];
    const c = colorVariants[colorKey];

    const currentDay = Math.max(1, tasks.length > 0 && completedTasks > 0
        ? Math.round((completedTasks / tasks.length) * duration)
        : 1);
    const dayLabel = `Day${String(currentDay).padStart(2, "0")} / Day${String(duration).padStart(2, "0")}`;
    const taskLabel = `${completedTasks} / ${tasks.length} Tasks Completed`;

    const W = 220;
    const H = 270;
    const spineW = 30;
    const contentX = spineW + 14;
    const contentW = W - contentX - 14;
    const centerX = contentX + contentW / 2;

    // Punch holes
    const holes = [H * 0.2, H * 0.5, H * 0.8];
    const holeR = 6;

    // Spiral rings
    const ringCount = 18;
    const ringSpacing = H / (ringCount + 1);

    return (
        <motion.div
            whileHover={{
                y: -8,
                rotate: -1,
                transition: { type: "spring", stiffness: 300, damping: 18 },
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={onClick}
            className={`relative cursor-pointer group select-none ${className}`}
            style={{ width: W, margin: "0 auto" }}
        >
            {/* Drop shadow */}
            <div style={{
                position: "absolute",
                bottom: -8,
                left: 12,
                right: 12,
                height: 16,
                background: "rgba(0,0,0,0.13)",
                borderRadius: "50%",
                filter: "blur(8px)",
            }} />

            <svg
                width={W}
                height={H}
                viewBox={`0 0 ${W} ${H}`}
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.12))" }}
            >
                {/* Page stack illusion */}
                <rect x={spineW + 3} y={3} width={W - spineW - 3} height={H - 3} rx={3} fill={c.coverDark} opacity="0.25" />
                <rect x={spineW + 1.5} y={1.5} width={W - spineW - 1.5} height={H - 1.5} rx={3} fill={c.coverDark} opacity="0.15" />

                {/* Main cover */}
                <rect x={spineW} y={0} width={W - spineW} height={H} rx={3} fill={c.cover} />

                {/* Subtle left-edge shadow on cover */}
                <rect x={spineW} y={0} width={10} height={H} fill={c.coverDark} opacity="0.12" />

                {/* Spine */}
                <rect x={0} y={0} width={spineW} height={H} rx={3} fill={c.spine} />
                <rect x={spineW - 3} y={0} width={6} height={H} fill={c.spineAccent} opacity="0.45" />

                {/* ── SPIRAL RINGS ── */}
                {Array.from({ length: ringCount }).map((_, i) => {
                    const ry = ringSpacing * (i + 1);
                    const rx = spineW;
                    return (
                        <g key={i}>
                            {/* Back arc (spine side) */}
                            <path
                                d={`M${rx - 7},${ry - 5} Q${rx - 12},${ry} ${rx - 7},${ry + 5}`}
                                fill="none"
                                stroke={c.spiralColor}
                                strokeWidth="1.8"
                                opacity="0.45"
                                strokeLinecap="round"
                            />
                            {/* Front arc (cover side) */}
                            <path
                                d={`M${rx - 7},${ry - 5} Q${rx + 6},${ry} ${rx - 7},${ry + 5}`}
                                fill="none"
                                stroke={c.spiralColor}
                                strokeWidth="2.2"
                                strokeLinecap="round"
                            />
                        </g>
                    );
                })}

                {/* ── PUNCH HOLES on spine ── */}
                {holes.map((hy, i) => (
                    <g key={i}>
                        <circle cx={spineW / 2} cy={hy + 1} r={holeR} fill="rgba(0,0,0,0.12)" />
                        <circle cx={spineW / 2} cy={hy} r={holeR} fill={c.holeColor} stroke={c.holeBorder} strokeWidth="1.5" />
                        <circle cx={spineW / 2} cy={hy} r={holeR - 2.5} fill="rgba(0,0,0,0.07)" />
                    </g>
                ))}

                {/* ── RULED LINES (notebook feel) ── */}
                {[0.44, 0.60, 0.76, 0.89].map((t, i) => (
                    <line
                        key={i}
                        x1={contentX}
                        y1={H * t}
                        x2={W - 12}
                        y2={H * t}
                        stroke={c.lineColor}
                        strokeWidth="0.8"
                    />
                ))}

                {/* ── TITLE with double quotes — centered ── */}
                <foreignObject x={contentX} y={H * 0.18} width={contentW} height={100}>
                    <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        style={{
                            color: c.text,
                            fontSize: "13px",
                            fontWeight: "700",
                            textAlign: "center",
                            lineHeight: "1.45",
                            wordBreak: "break-word",
                            padding: "0 4px",
                        }}
                    >
                        &ldquo;{title}&rdquo;
                    </div>
                </foreignObject>

                {/* ── LINE 1: Day progress ── */}
                <text
                    x={centerX}
                    y={H * 0.70}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={c.textLight}
                    letterSpacing="0.4"
                >
                    {dayLabel}
                </text>

                {/* ── LINE 2: Tasks completed ── */}
                <text
                    x={centerX}
                    y={H * 0.855}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="500"
                    fill={c.textLight}
                    letterSpacing="0.3"
                    opacity="0.85"
                >
                    {taskLabel}
                </text>

                {/* Bottom-right corner fold */}
                <polygon
                    points={`${W},${H - 18} ${W - 18},${H} ${W},${H}`}
                    fill={c.coverDark}
                    opacity="0.35"
                />
            </svg>
        </motion.div>
    );
};

export default NotebookChallenge;