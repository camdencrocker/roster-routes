(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/kg-celtics-tree/lib/headshots.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getHeadshotFallback",
    ()=>getHeadshotFallback,
    "getHeadshotUrl",
    ()=>getHeadshotUrl
]);
/** Headshot URLs — pattern from Roster Routes app/headshots.ts */ const NBA_CDN = "https://cdn.nba.com/headshots/nba/latest/1040x760";
const FALLBACK = `${NBA_CDN}/logoman.png`;
function getHeadshotUrl(nbaId) {
    if (!nbaId || !/^\d+$/.test(nbaId)) return FALLBACK;
    return `${NBA_CDN}/${nbaId}.png`;
}
function getHeadshotFallback() {
    return FALLBACK;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/kg-celtics-tree/components/TreeNode.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DateNode",
    ()=>DateNode,
    "PickNode",
    ()=>PickNode,
    "PlayerNode",
    ()=>PlayerNode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/kg-celtics-tree/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/kg-celtics-tree/node_modules/@xyflow/react/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/kg-celtics-tree/node_modules/@xyflow/system/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ticket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ticket$3e$__ = __turbopack_context__.i("[project]/kg-celtics-tree/node_modules/lucide-react/dist/esm/icons/ticket.js [app-client] (ecmascript) <export default as Ticket>");
var __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$lib$2f$headshots$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/kg-celtics-tree/lib/headshots.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const CARD_W = 148;
const CARD_H = 168;
const HEADSHOT_SIZE = 80;
function PlayerNode({ id, data }) {
    const nbaId = data.nbaId ?? data.id;
    const name = data.label ?? data.name ?? "—";
    const teamColor = data.teamColor ?? "#007A33";
    const imgSrc = nbaId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$lib$2f$headshots$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getHeadshotUrl"])(nbaId) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$lib$2f$headshots$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getHeadshotFallback"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-[20px] overflow-hidden border border-white/10 bg-black/90 flex flex-col items-center shadow-xl",
        style: {
            width: CARD_W,
            height: CARD_H
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Handle"], {
                id: "topTarget",
                type: "target",
                position: __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Top,
                className: "!bg-transparent !border-0 !w-0 !h-0",
                style: {
                    left: "50%"
                }
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Handle"], {
                id: "bottom",
                type: "source",
                position: __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Bottom,
                className: "!bg-transparent !border-0 !w-0 !h-0",
                style: {
                    left: "50%"
                }
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            data.teamBadge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full px-2 py-0.5 text-center text-xs font-mono font-bold uppercase",
                style: {
                    backgroundColor: teamColor,
                    color: "#fff"
                },
                children: [
                    "→ ",
                    data.teamBadge
                ]
            }, void 0, true, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center pt-1 flex-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-full overflow-hidden border border-white/10 shrink-0",
                    style: {
                        width: HEADSHOT_SIZE,
                        height: HEADSHOT_SIZE
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: imgSrc,
                        className: "w-full h-full object-cover object-center",
                        onError: (e)=>e.target.src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$lib$2f$headshots$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getHeadshotFallback"])(),
                        alt: ""
                    }, void 0, false, {
                        fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                        lineNumber: 38,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full px-2 py-2 text-center border-t border-white/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm font-mono font-bold text-white truncate",
                    children: name
                }, void 0, false, {
                    fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = PlayerNode;
function PickNode({ id, data }) {
    const label = data.label ?? data.description ?? "Pick";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-[20px] border border-zinc-500/50 bg-black/90 flex flex-col items-center justify-center py-3 px-4 shadow-xl",
        style: {
            width: 140,
            height: 88
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Handle"], {
                id: "topTarget",
                type: "target",
                position: __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Top,
                className: "!bg-transparent !border-0 !w-0 !h-0"
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Handle"], {
                id: "bottom",
                type: "source",
                position: __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Bottom,
                className: "!bg-transparent !border-0 !w-0 !h-0"
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ticket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ticket$3e$__["Ticket"], {
                size: 18,
                className: "text-zinc-500 mb-1"
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm font-mono font-bold text-zinc-200 uppercase",
                children: label
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c1 = PickNode;
function DateNode({ id, data }) {
    const date = data.label ?? "—";
    const teams = data.teams ?? "—";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-lg border border-white/20 bg-black/60 flex flex-col items-center justify-center py-2 px-3 min-w-[140px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Handle"], {
                id: "topTarget",
                type: "target",
                position: __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Top,
                className: "!bg-transparent !border-0 !w-0 !h-0",
                style: {
                    left: "50%"
                }
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Handle"], {
                id: "bottom",
                type: "source",
                position: __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Bottom,
                className: "!bg-transparent !border-0 !w-0 !h-0",
                style: {
                    left: "50%"
                }
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm font-mono font-semibold text-zinc-200 uppercase",
                children: date
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs font-mono text-zinc-400 mt-0.5",
                children: teams
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/kg-celtics-tree/components/TreeNode.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_c2 = DateNode;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "PlayerNode");
__turbopack_context__.k.register(_c1, "PickNode");
__turbopack_context__.k.register(_c2, "DateNode");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/kg-celtics-tree/data/celtics-kg-trades.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"title":"Boston Celtics — Kevin Garnett Trade Tree","originDate":"2007-07-31","lastUpdated":"2023-07-05","source":"CHILLIEBW infographic @chillie302","trades":[{"id":"2007-kg","date":"2007-07-31","teams":["BOS","MIN"],"summary":"Kevin Garnett to Celtics","assets":[{"type":"player","name":"Kevin Garnett","nbaId":"708","from":"MIN","to":"BOS"},{"type":"pick","description":"2009 1st (MIN)","from":"MIN","to":"BOS","drafted_player":{"name":"Wayne Ellington","nbaId":"201961"}},{"type":"pick","description":"2009 2nd (MIN)","from":"MIN","to":"BOS","drafted_player":{"name":"Lester Hudson","nbaId":"201991"}},{"type":"pick","description":"2007 2nd (MIN)","from":"MIN","to":"BOS"}]},{"id":"2012-dj-white-okc","date":"2012-03-15","teams":["BOS","OKC"],"summary":"D.J. White, Harangody, Erden to OKC","assets":[{"type":"player","name":"D.J. White","nbaId":"201591","from":"BOS","to":"OKC","isSent":true},{"type":"player","name":"Nenad Krstic","nbaId":"2420","from":"OKC","to":"BOS"},{"type":"player","name":"Jeff Green","nbaId":"201145","from":"OKC","to":"BOS"},{"type":"pick","description":"2012 1st (OKC)","from":"OKC","to":"BOS","drafted_player":{"name":"Jared Sullinger","nbaId":"203106"}}]},{"id":"2012-okc-houston","date":"2012-06-26","teams":["BOS","HOU"],"summary":"2012 1st (OKC) to Houston","assets":[{"type":"pick","description":"2012 1st (OKC)","from":"BOS","to":"HOU","isSent":true},{"type":"pick","description":"2012 1st (HOU)","from":"HOU","to":"BOS","drafted_player":{"name":"Jared Sullinger","nbaId":"203106"}},{"type":"pick","description":"2012 2nd (HOU)","from":"HOU","to":"BOS","drafted_player":{"name":"Kris Joseph","nbaId":"203130"}}]},{"id":"2013-brooklyn","date":"2013-07-12","teams":["BOS","BKN"],"summary":"KG + Pierce to Brooklyn","assets":[{"type":"player","name":"Kevin Garnett","nbaId":"708","from":"BOS","to":"BKN","isSent":true},{"type":"player","name":"Paul Pierce","nbaId":"1718","from":"BOS","to":"BKN","isSent":true},{"type":"player","name":"Jason Terry","nbaId":"1891","from":"BOS","to":"BKN","isSent":true},{"type":"player","name":"D.J. White","nbaId":"201591","from":"BOS","to":"BKN","isSent":true},{"type":"player","name":"Kris Humphries","nbaId":"2743","from":"BKN","to":"BOS"},{"type":"player","name":"Gerald Wallace","nbaId":"2222","from":"BKN","to":"BOS"},{"type":"player","name":"MarShon Brooks","nbaId":"202705","from":"BKN","to":"BOS"},{"type":"player","name":"Keith Bogans","nbaId":"2586","from":"BKN","to":"BOS"},{"type":"player","name":"Jordan Crawford","nbaId":"202348","from":"BKN","to":"BOS"},{"type":"pick","description":"2014 1st (BKN)","from":"BKN","to":"BOS","drafted_player":{"name":"Marcus Smart","nbaId":"203935"}},{"type":"pick","description":"2016 1st (BKN)","from":"BKN","to":"BOS","drafted_player":{"name":"Jaylen Brown","nbaId":"1627759"}},{"type":"pick","description":"2018 1st (BKN)","from":"BKN","to":"BOS","drafted_player":{"name":"Robert Williams III","nbaId":"1629056"}},{"type":"pick","description":"2017 1st swap (BKN)","from":"BKN","to":"BOS"}]},{"id":"2014-washington","date":"2014-01-15","teams":["BOS","WAS"],"summary":"Humphries, Wallace, Brooks, Bogans, Crawford, BKN picks to Washington","assets":[{"type":"player","name":"Kelly Olynyk","nbaId":"203482","from":"WAS","to":"BOS"},{"type":"player","name":"Tyler Zeller","nbaId":"203469","from":"WAS","to":"BOS"}]},{"id":"2015-jeff-green-memphis","date":"2015-01-12","teams":["BOS","MEM"],"summary":"Jeff Green to Memphis","assets":[{"type":"player","name":"Jeff Green","nbaId":"201145","from":"BOS","to":"MEM","isSent":true},{"type":"player","name":"Tayshaun Prince","nbaId":"2419","from":"MEM","to":"BOS"},{"type":"pick","description":"2015 1st (MEM)","from":"MEM","to":"BOS","drafted_player":{"name":"Terry Rozier","nbaId":"1626179"}}]},{"id":"2015-prince-detroit","date":"2015-02-19","teams":["BOS","DET"],"summary":"Tayshaun Prince to Detroit","assets":[{"type":"player","name":"Tayshaun Prince","nbaId":"2419","from":"BOS","to":"DET","isSent":true},{"type":"player","name":"Jonas Jerebko","nbaId":"201973","from":"DET","to":"BOS"},{"type":"player","name":"Luigi Datome","nbaId":"203540","from":"DET","to":"BOS"},{"type":"pick","description":"2016 2nd (DET)","from":"DET","to":"BOS","drafted_player":{"name":"Malcolm Brogdon","nbaId":"1627763"}}]},{"id":"2015-jerebko-utah","date":"2015-07-27","teams":["BOS","UTA"],"summary":"Jerebko, Datome to Utah","assets":[{"type":"player","name":"Jonas Jerebko","nbaId":"201973","from":"BOS","to":"UTA","isSent":true},{"type":"player","name":"Luigi Datome","nbaId":"203540","from":"BOS","to":"UTA","isSent":true},{"type":"pick","description":"2016 2nd (MEM)","from":"UTA","to":"BOS"},{"type":"pick","description":"2016 2nd (UTA)","from":"UTA","to":"BOS","drafted_player":{"name":"Ben Bentil","nbaId":"1627791"}}]},{"id":"2017-olynyk-miami","date":"2017-07-06","teams":["BOS","MIA"],"summary":"Kelly Olynyk to Miami","assets":[{"type":"player","name":"Kelly Olynyk","nbaId":"203482","from":"BOS","to":"MIA","isSent":true},{"type":"pick","description":"2017 2nd (MIA)","from":"MIA","to":"BOS"},{"type":"pick","description":"2017 2nd (WAS)","from":"MIA","to":"BOS"}]},{"id":"2017-tatum-fultz","date":"2017-06-19","teams":["BOS","PHI"],"summary":"2017 1st swap → Tatum","assets":[{"type":"pick","description":"2017 1st swap (BKN)","from":"BOS","to":"PHI","isSent":true},{"type":"pick","description":"2017 1st (PHI)","from":"PHI","to":"BOS","drafted_player":{"name":"Jayson Tatum","nbaId":"1628369"}}]},{"id":"2017-zeller-brooklyn","date":"2017-07-12","teams":["BOS","BKN"],"summary":"Tyler Zeller to Brooklyn","assets":[{"type":"player","name":"Tyler Zeller","nbaId":"203469","from":"BOS","to":"BKN","isSent":true},{"type":"pick","description":"2018 2nd (IND)","from":"BKN","to":"BOS"}]},{"id":"2017-picks","date":"2017","teams":["BOS"],"summary":"2017 draft — Semi Ojeleye (LAC), etc.","assets":[{"type":"player","name":"Semi Ojeleye","nbaId":"1628400","from":"LAC","to":"BOS"}]},{"id":"2018-picks","date":"2018","teams":["BOS"],"summary":"2018 draft — Robert Williams III (CLE)","assets":[{"type":"player","name":"Robert Williams III","nbaId":"1629056","from":"CLE","to":"BOS"}]},{"id":"2019-picks","date":"2019","teams":["BOS"],"summary":"2019 draft — Romeo Langford, Grant Williams, Carsen Edwards","assets":[{"type":"player","name":"Romeo Langford","nbaId":"1629641","from":"LAC","to":"BOS"},{"type":"player","name":"Grant Williams","nbaId":"1629026","from":"MEM","to":"BOS"},{"type":"player","name":"Carsen Edwards","nbaId":"1629035","from":"BOS","to":"BOS"}]},{"id":"2020-picks","date":"2020","teams":["BOS"],"summary":"2020 draft — Payton Pritchard, Aaron Nesmith","assets":[{"type":"player","name":"Payton Pritchard","nbaId":"1630202","from":"MEM","to":"BOS"},{"type":"player","name":"Aaron Nesmith","nbaId":"1630174","from":"MIL","to":"BOS"}]},{"id":"2021-horford","date":"2021-06-18","teams":["BOS","OKC"],"summary":"2021 1st (OKC) → Al Horford, Josh Richardson","assets":[{"type":"player","name":"Al Horford","nbaId":"201143","from":"OKC","to":"BOS"},{"type":"player","name":"Josh Richardson","nbaId":"1626196","from":"OKC","to":"BOS"}]},{"id":"2022-derrick-white","date":"2022-02-10","teams":["BOS","SAS"],"summary":"Josh Richardson, Romeo Langford, picks → Derrick White","assets":[{"type":"player","name":"Josh Richardson","nbaId":"1626196","from":"BOS","to":"SAS","isSent":true},{"type":"player","name":"Romeo Langford","nbaId":"1629641","from":"BOS","to":"SAS","isSent":true},{"type":"player","name":"Derrick White","nbaId":"1628401","from":"SAS","to":"BOS"}]}]});}),
"[project]/kg-celtics-tree/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/kg-celtics-tree/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/kg-celtics-tree/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/kg-celtics-tree/node_modules/@xyflow/react/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$components$2f$TreeNode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/kg-celtics-tree/components/TreeNode.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$data$2f$celtics$2d$kg$2d$trades$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/kg-celtics-tree/data/celtics-kg-trades.json (json)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const nodeTypes = {
    player: __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$components$2f$TreeNode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlayerNode"],
    pick: __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$components$2f$TreeNode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PickNode"],
    date: __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$components$2f$TreeNode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DateNode"]
};
function DirectEdge({ sourceX, sourceY, targetX, targetY, style = {} }) {
    const stroke = style?.stroke || "rgba(255,255,255,0.35)";
    const path = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BaseEdge"], {
        path: path,
        style: {
            stroke,
            strokeWidth: 2.25
        }
    }, void 0, false, {
        fileName: "[project]/kg-celtics-tree/app/page.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c = DirectEdge;
const edgeTypes = {
    direct: DirectEdge
};
const BOS_COLOR = "#007A33";
function buildTree() {
    const trades = __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$data$2f$celtics$2d$kg$2d$trades$2e$json__$28$json$29$__["default"].trades;
    const nodes = [];
    const edges = [];
    let y = 50;
    const centerX = 400;
    const gap = 100;
    for(let i = 0; i < trades.length; i++){
        const t = trades[i];
        const dateId = `date-${t.id}`;
        const teamsStr = Array.isArray(t.teams) ? t.teams.join(" ↔ ") : t.teams;
        nodes.push({
            id: dateId,
            type: "date",
            position: {
                x: centerX - 70,
                y
            },
            data: {
                label: t.date,
                teams: teamsStr
            }
        });
        y += 50;
        const assets = (t.assets || []).filter((a)=>!a.isSent);
        const assetCount = assets.length;
        const startX = centerX - (assetCount - 1) * gap / 2;
        for(let j = 0; j < assets.length; j++){
            const a = assets[j];
            const nodeId = `node-${t.id}-${j}`;
            const nodeX = startX + j * gap;
            nodes.push({
                id: nodeId,
                type: a.type === "player" ? "player" : "pick",
                position: {
                    x: nodeX,
                    y
                },
                data: {
                    ...a,
                    label: a.name ?? a.description,
                    teamBadge: a.to,
                    teamColor: BOS_COLOR
                }
            });
            edges.push({
                id: `e-${dateId}-${nodeId}`,
                source: dateId,
                target: nodeId,
                sourceHandle: "bottom",
                targetHandle: "topTarget",
                type: "direct"
            });
        }
        y += 200;
    }
    return {
        nodes,
        edges
    };
}
function Tree() {
    _s();
    const { nodes: initialNodes, edges: initialEdges } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(buildTree, []);
    const [nodes, , onNodesChange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNodesState"])(initialNodes);
    const [edges, , onEdgesChange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEdgesState"])(initialEdges);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-screen bg-black",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-4 left-4 z-10 text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$data$2f$celtics$2d$kg$2d$trades$2e$json__$28$json$29$__["default"].title
                    }, void 0, false, {
                        fileName: "[project]/kg-celtics-tree/app/page.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-zinc-400 text-sm",
                        children: [
                            "Origin: ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$data$2f$celtics$2d$kg$2d$trades$2e$json__$28$json$29$__["default"].originDate
                        ]
                    }, void 0, true, {
                        fileName: "[project]/kg-celtics-tree/app/page.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-zinc-500 text-xs mt-2",
                        children: "Patterns from Roster Routes"
                    }, void 0, false, {
                        fileName: "[project]/kg-celtics-tree/app/page.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/kg-celtics-tree/app/page.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ReactFlow"], {
                nodes: nodes,
                edges: edges,
                onNodesChange: onNodesChange,
                onEdgesChange: onEdgesChange,
                nodeTypes: nodeTypes,
                edgeTypes: edgeTypes,
                fitView: true,
                fitViewOptions: {
                    padding: 0.2
                },
                minZoom: 0.2,
                maxZoom: 1.5,
                proOptions: {
                    hideAttribution: true
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Controls"], {
                    className: "!bg-zinc-900 !border-white/20"
                }, void 0, false, {
                    fileName: "[project]/kg-celtics-tree/app/page.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/kg-celtics-tree/app/page.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/kg-celtics-tree/app/page.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
_s(Tree, "L60MslZLlLblCgY1J0u6WB3qdqo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNodesState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEdgesState"]
    ];
});
_c1 = Tree;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ReactFlowProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$kg$2d$celtics$2d$tree$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tree, {}, void 0, false, {
            fileName: "[project]/kg-celtics-tree/app/page.tsx",
            lineNumber: 117,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/kg-celtics-tree/app/page.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
_c2 = Page;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "DirectEdge");
__turbopack_context__.k.register(_c1, "Tree");
__turbopack_context__.k.register(_c2, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=kg-celtics-tree_26eccf13._.js.map