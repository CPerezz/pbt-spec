import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// PARTITIONED BINARY TREE (PBT)
// A Zone-Structured Unified Binary State Tree for Ethereum
// ═══════════════════════════════════════════════════════════════

const C = {
  bg: "#0A0E17",
  card: "#111827",
  cardBorder: "#1E293B",
  text: "#E2E8F0",
  muted: "#94A3B8",
  dim: "#475569",
  account: "#22D3EE",
  accountDim: "#164E63",
  storage: "#A78BFA",
  storageDim: "#4C1D95",
  code: "#34D399",
  codeDim: "#064E3B",
  structural: "#F59E0B",
  structuralDim: "#78350F",
  danger: "#EF4444",
  dangerDim: "#7F1D1D",
  success: "#10B981",
  accent: "#F472B6",
};

const font = {
  mono: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
  sans: "'IBM Plex Sans', 'Inter', sans-serif",
};

// ── Shared Components ──────────────────────────────────────────

function Card({ title, color = C.text, children, id }) {
  return (
    <div id={id} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "28px 32px", marginBottom: 28, borderTop: `3px solid ${color}` }}>
      {title && (
        <h3 style={{ fontFamily: font.mono, fontSize: 13, fontWeight: 700, color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18, marginTop: 0 }}>{title}</h3>
      )}
      {children}
    </div>
  );
}

function P({ children, style = {} }) {
  return <p style={{ fontFamily: font.sans, fontSize: 14, lineHeight: 1.75, color: C.muted, marginBottom: 14, ...style }}>{children}</p>;
}

function S({ children, c = C.text }) {
  return <span style={{ color: c, fontWeight: 600 }}>{children}</span>;
}

function Code({ children }) {
  return <code style={{ fontFamily: font.mono, fontSize: 12, background: "#1E293B", padding: "2px 7px", borderRadius: 4, color: C.structural, border: "1px solid #334155" }}>{children}</code>;
}

function CodeBlock({ children, title }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {title && <div style={{ fontFamily: font.mono, fontSize: 10, color: C.dim, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>{title}</div>}
      <pre style={{ fontFamily: font.mono, fontSize: 11.5, lineHeight: 1.65, background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, padding: "18px 22px", overflowX: "auto", color: C.text, margin: 0 }}>{children}</pre>
    </div>
  );
}

function Callout({ type = "info", children }) {
  const colors = { info: { bg: "#0C4A6E20", border: C.account, icon: "ℹ" }, warn: { bg: "#78350F20", border: C.structural, icon: "⚠" }, danger: { bg: "#7F1D1D20", border: C.danger, icon: "✕" }, success: { bg: "#064E3B20", border: C.success, icon: "✓" } };
  const cl = colors[type];
  return (
    <div style={{ background: cl.bg, border: `1px solid ${cl.border}40`, borderLeft: `4px solid ${cl.border}`, borderRadius: "0 8px 8px 0", padding: "14px 20px", marginBottom: 18 }}>
      <span style={{ marginRight: 8, color: cl.border, fontWeight: 700 }}>{cl.icon}</span>
      <span style={{ fontFamily: font.sans, fontSize: 13, color: C.text, lineHeight: 1.7 }}>{children}</span>
    </div>
  );
}

function SectionDivider({ number, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "44px 0 24px" }}>
      <div style={{ fontFamily: font.mono, fontSize: 11, color: C.structural, background: C.structuralDim + "40", border: `1px solid ${C.structural}40`, borderRadius: 6, padding: "4px 10px", letterSpacing: "0.1em", flexShrink: 0 }}>§{number}</div>
      <h2 style={{ fontFamily: font.mono, fontSize: 16, fontWeight: 700, color: C.text, margin: 0, letterSpacing: "0.03em" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.cardBorder}, transparent)` }} />
    </div>
  );
}

function KeyLayoutBar({ segments, total }) {
  return (
    <div>
      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1px solid ${C.cardBorder}` }}>
        {segments.map((seg, i) => {
          const pct = (seg.bits / total) * 100;
          return (
            <div key={i} style={{ width: `${Math.max(pct, 7)}%`, background: seg.color + "25", borderRight: i < segments.length - 1 ? `1px solid ${C.cardBorder}` : "none", padding: "10px 4px 8px", textAlign: "center", minWidth: 44 }}>
              <div style={{ fontFamily: font.mono, fontSize: 9.5, color: seg.color, fontWeight: 700, marginBottom: 3 }}>{seg.label}</div>
              <div style={{ fontFamily: font.mono, fontSize: 8.5, color: C.dim }}>{seg.bits}b</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", marginTop: 6 }}>
        {segments.map((seg, i) => {
          const pct = (seg.bits / total) * 100;
          return (
            <div key={i} style={{ width: `${Math.max(pct, 7)}%`, fontFamily: font.mono, fontSize: 7.5, color: C.dim, textAlign: "center", minWidth: 44, wordBreak: "break-all", padding: "0 1px" }}>{seg.value}</div>
          );
        })}
      </div>
      <div style={{ fontFamily: font.mono, fontSize: 10, color: C.dim, textAlign: "right", marginTop: 6 }}>total: {total} bits</div>
    </div>
  );
}

// ── Nav ────────────────────────────────────────────────────────

const sections = [
  { id: "overview", label: "Overview", num: "1" },
  { id: "zones", label: "Zones", num: "2" },
  { id: "keyspace", label: "Key Space", num: "3" },
  { id: "topology", label: "Topology", num: "4" },
  { id: "root", label: "Root Computation", num: "5" },
  { id: "stems", label: "Stems", num: "6" },
  { id: "expiry", label: "State Expiry", num: "7" },
  { id: "privacy", label: "Privacy", num: "8" },
  { id: "security", label: "Security", num: "9" },
  { id: "questions", label: "Open Questions", num: "10" },
];

function Nav({ active, onNav }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 32, padding: "14px 18px", background: "#0F172A", borderRadius: 10, border: `1px solid ${C.cardBorder}` }}>
      {sections.map((s) => (
        <button key={s.id} data-target={s.id} onClick={() => onNav(s.id)} style={{ fontFamily: font.mono, fontSize: 10.5, padding: "6px 12px", borderRadius: 6, border: `1px solid ${active === s.id ? C.structural : C.cardBorder}`, background: active === s.id ? C.structuralDim + "40" : "transparent", color: active === s.id ? C.structural : C.dim, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.04em" }}>
          {s.num}. {s.label}
        </button>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 1: OVERVIEW
// ══════════════════════════════════════════════════════════════

function OverviewSection() {
  return (
    <>
      <SectionDivider number="1" title="Overview" />

      <Card title="What Is the Partitioned Binary Tree?" color={C.text}>
        <P>
          The Partitioned Binary Tree (PBT) is a <S>unified binary state tree</S> for Ethereum
          that stores all state — account headers, contract storage, and contract code — in a
          single non-sparse binary trie while preserving <S c={C.structural}>structural boundaries</S> between
          semantic categories of data.
        </P>
        <P>
          Unlike a flat unified tree where all key-value pairs are undifferentiated, PBT uses a
          deterministic key derivation scheme that embeds <S c={C.structural}>zone</S> and{" "}
          <S c={C.structural}>account identity</S> information directly into the key structure. This creates
          topological boundaries in the tree that protocols can reason about: a node at a known
          depth is always the root of a specific account's storage, or the root of all code, etc.
        </P>
        <P>
          PBT uses <S>uniform 256-bit keys</S> across all zones, with zone prefixes encoding data
          category. In a non-sparse trie, unused key space costs nothing — actual tree depth adapts
          to content density, not key width. Storage achieves collision resistance within 256 bits
          by combining a 60-bit address prefix for account-local grouping with a 187-bit stem
          suffix derived from both the address and storage index.
        </P>
      </Card>

      <Card title="Design Goals" color={C.structural}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { title: "No Sequential Dependency", desc: "Root computation is a single bottom-up pass. No leaf value contains a hash of another part of the tree. Account headers do not store storage_root. Zones propagate upward independently.", color: C.success },
            { title: "Structural Semantics", desc: "The tree topology carries meaning. Zone boundaries, per-account subtree roots, and data categories are intrinsic to the tree structure — not just a property of the key derivation scheme, but of the tree itself.", color: C.structural },
            { title: "Future-Proof Security", desc: "245-bit account keys (birthday bound 2¹²²·⁵). 187-bit storage stem suffix (birthday bound 2⁹³·⁵). 60-bit address prefix for account-local grouping. Designed to resist foreseeable advances in computational power.", color: C.danger },
            { title: "State Distribution Alignment", desc: "Storage gets 50% of the tree (1-bit prefix). Accounts and code use 3-bit prefixes (12.5% each). Prefix '01' (25%) is reserved for future state categories. Ethereum state: ~75% storage, ~20% accounts, ~5% code. The non-sparse trie adapts naturally to actual population density.", color: C.storage },
            { title: "Protocol Enablement", desc: "Structural boundaries enable Valid-only Partial Statelessness (VOPS), partial statefulness schemes, per-account state expiry, zone-based sharding, and archival pruning — all as natural operations on the tree topology.", color: C.account },
          ].map((item, i) => (
            <div key={i} style={{ background: "#0F172A", border: `1px solid ${item.color}30`, borderRadius: 8, padding: "16px 18px" }}>
              <div style={{ fontFamily: font.mono, fontSize: 11, color: item.color, fontWeight: 700, marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontFamily: font.sans, fontSize: 12, color: C.muted, lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 2: ZONES
// ══════════════════════════════════════════════════════════════

function ZoneSection() {
  return (
    <>
      <SectionDivider number="2" title="Zone Architecture" />

      <Card title="Three Semantic Zones" color={C.text}>
        <P>
          PBT partitions the key space into three <S c={C.structural}>zones</S>, each storing a
          different category of Ethereum state. The zone is encoded in the most significant bits
          of every key using variable-width prefixes: 1 bit for storage, 3 bits for accounts and
          code, and 2 bits for a reserved zone.
        </P>
        <P>
          Storage uses a <S c={C.storage}>1-bit prefix</S> ("1"), giving it 50% of the top-level
          tree address space. At depth 1, the right child of the root IS the root of all storage.
          Accounts ("000") and code ("001") use 3-bit prefixes, each occupying 12.5%. Prefix "01"
          (25%) is reserved for future state categories.
        </P>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 18 }}>
          {[
            { zone: "000", label: "Account Headers", color: C.account, bits: "256", pct: "12.5%", prefix: "3-bit", contents: "Per-account header stem (EIP-7864 layout): BASIC_DATA, CODE_HASH, first 64 storage slots, and first 128 code chunks. Up to 194 populated leaves per account. 245-bit address hash provides 2¹²²·⁵ birthday resistance." },
            { zone: "001", label: "Code Chunks", color: C.code, bits: "256", pct: "12.5%", prefix: "3-bit", contents: "Content-addressed code chunks beyond the first 128 (which live in the account header). Keyed by H(code_hash || tree_index)[:245], enabling deduplication of identical bytecodes across contracts." },
            { zone: "1", label: "Contract Storage", color: C.storage, bits: "256", pct: "50%", prefix: "1-bit", contents: "All contract storage slots. 256-bit keys with 60-bit address prefix for account-local grouping and 187-bit stem suffix. The dominant data category in Ethereum state (~75%)." },
          ].map((z, i) => (
            <div key={i} style={{ background: "#0F172A", border: `1px solid ${z.color}30`, borderRadius: 8, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <div style={{ fontFamily: font.mono, fontSize: 22, color: z.color, fontWeight: 800 }}>{z.zone}</div>
                <div style={{ fontFamily: font.mono, fontSize: 10, color: C.dim }}>{z.pct} of tree</div>
              </div>
              <div style={{ fontFamily: font.mono, fontSize: 11, color: z.color, fontWeight: 700, marginBottom: 6 }}>{z.label}</div>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, marginBottom: 8, lineHeight: 1.5 }}>
                <div>Key width: <span style={{ color: C.text }}>{z.bits} bits</span></div>
                <div>Prefix: <span style={{ color: C.text }}>{z.prefix}</span></div>
              </div>
              <div style={{ fontFamily: font.sans, fontSize: 11, color: C.dim, lineHeight: 1.6 }}>{z.contents}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Why This Distribution?" color={C.storage}>
        <P>
          Ethereum's state is approximately <S c={C.storage}>75% contract storage</S>,{" "}
          <S c={C.account}>20% account headers</S>, and <S c={C.code}>5% code</S>. Allocating
          equal tree space to all data types would create an imbalanced tree where the storage subtree
          is significantly denser than the others.
        </P>
        <P>
          By giving storage a 1-bit prefix (50% of tree space), the tree is more balanced at the top
          levels. This reduces average proof depth for storage lookups — the most common operation — and
          creates a natural split at depth 1: left child = accounts and code, right child = all storage.
        </P>
        <Callout type="warn">
          <S c={C.structural}>Design note — zone prefix rationale.</S> Storage gets a 1-bit prefix ("1"),
          occupying 50% of the tree and rooted at a single node (depth 1, right child). The left subtree
          ("0") splits at depth 2 into "00" (accounts + code, 25%) and "01" (reserved, 25%). At depth 3,
          "00" further splits into accounts ("000", 12.5%) and code ("001", 12.5%). The reserved "01"
          prefix enables future state categories (e.g., precompile state, beacon chain roots) without
          restructuring the tree. In a non-sparse trie, actual tree balance depends on leaf population,
          not address space allocation — the unused reserved zone creates no overhead.
        </Callout>
      </Card>

      <Card title="Top-Level Tree Topology" color={C.structural}>
        <svg viewBox="0 0 700 300" style={{ width: "100%", background: "#080C14", borderRadius: 8 }}>
          <circle cx={350} cy={35} r={12} fill={C.bg} stroke={C.text} strokeWidth={2} />
          <text x={350} y={39} textAnchor="middle" fill={C.text} fontSize={8} fontFamily={font.mono} fontWeight="700">ROOT</text>

          <line x1={350} y1={47} x2={200} y2={90} stroke={C.dim} strokeWidth={1.5} />
          <line x1={350} y1={47} x2={550} y2={90} stroke={C.storage} strokeWidth={2.5} />

          <text x={275} y={65} textAnchor="middle" fill={C.dim} fontSize={8} fontFamily={font.mono}>bit 0</text>
          <text x={450} y={65} textAnchor="middle" fill={C.storage} fontSize={8} fontFamily={font.mono}>bit 1</text>

          <text x={30} y={100} fill={C.structural} fontSize={8} fontFamily={font.mono} fontWeight="700">d=1</text>
          <line x1={50} y1={97} x2={180} y2={97} stroke={C.structural} strokeWidth={0.5} strokeDasharray="2,3" />

          <circle cx={200} cy={97} r={9} fill={C.bg} stroke={C.dim} strokeWidth={1.5} />
          <text x={200} y={101} textAnchor="middle" fill={C.dim} fontSize={7} fontFamily={font.mono} fontWeight="700">0_</text>

          <circle cx={550} cy={97} r={14} fill={C.storageDim + "50"} stroke={C.storage} strokeWidth={2} />
          <text x={550} y={101} textAnchor="middle" fill={C.storage} fontSize={9} fontFamily={font.mono} fontWeight="800">1</text>
          <text x={550} y={124} textAnchor="middle" fill={C.storage} fontSize={9} fontFamily={font.mono} fontWeight="600">ALL STORAGE</text>
          <text x={550} y={137} textAnchor="middle" fill={C.dim} fontSize={7.5} fontFamily={font.mono}>50% of tree • 256-bit keys</text>

          {/* d=2: 00 and 01 (reserved) */}
          <line x1={200} y1={106} x2={120} y2={155} stroke={C.dim} strokeWidth={1.5} />
          <line x1={200} y1={106} x2={300} y2={155} stroke={C.dim} strokeWidth={1.5} strokeDasharray="4,3" />

          <text x={30} y={165} fill={C.structural} fontSize={8} fontFamily={font.mono} fontWeight="700">d=2</text>
          <line x1={50} y1={162} x2={95} y2={162} stroke={C.structural} strokeWidth={0.5} strokeDasharray="2,3" />

          <circle cx={120} cy={162} r={9} fill={C.bg} stroke={C.dim} strokeWidth={1.5} />
          <text x={120} y={166} textAnchor="middle" fill={C.dim} fontSize={7} fontFamily={font.mono} fontWeight="700">00</text>

          <circle cx={300} cy={162} r={11} fill={"#33415520"} stroke={C.dim} strokeWidth={1.5} strokeDasharray="3,2" />
          <text x={300} y={166} textAnchor="middle" fill={C.dim} fontSize={7} fontFamily={font.mono} fontWeight="700">01</text>
          <text x={300} y={186} textAnchor="middle" fill={C.dim} fontSize={7.5} fontFamily={font.mono}>Reserved</text>
          <text x={300} y={199} textAnchor="middle" fill={C.dim} fontSize={6.5} fontFamily={font.mono}>25% • future use</text>

          {/* d=3: 000 (accounts) and 001 (code) */}
          <line x1={120} y1={171} x2={70} y2={228} stroke={C.account} strokeWidth={1.5} />
          <line x1={120} y1={171} x2={180} y2={228} stroke={C.code} strokeWidth={1.5} />

          <text x={30} y={240} fill={C.structural} fontSize={8} fontFamily={font.mono} fontWeight="700">d=3</text>
          <line x1={50} y1={237} x2={55} y2={237} stroke={C.structural} strokeWidth={0.5} strokeDasharray="2,3" />

          <circle cx={70} cy={235} r={11} fill={C.accountDim + "40"} stroke={C.account} strokeWidth={1.5} />
          <text x={70} y={239} textAnchor="middle" fill={C.account} fontSize={6.5} fontFamily={font.mono} fontWeight="700">000</text>
          <text x={70} y={259} textAnchor="middle" fill={C.account} fontSize={8} fontFamily={font.mono}>Accounts</text>
          <text x={70} y={272} textAnchor="middle" fill={C.dim} fontSize={6.5} fontFamily={font.mono}>12.5% • 256-bit keys</text>

          <circle cx={180} cy={235} r={11} fill={C.codeDim + "40"} stroke={C.code} strokeWidth={1.5} />
          <text x={180} y={239} textAnchor="middle" fill={C.code} fontSize={6.5} fontFamily={font.mono} fontWeight="700">001</text>
          <text x={180} y={259} textAnchor="middle" fill={C.code} fontSize={8} fontFamily={font.mono}>Code</text>
          <text x={180} y={272} textAnchor="middle" fill={C.dim} fontSize={6.5} fontFamily={font.mono}>12.5% • 256-bit keys</text>
        </svg>
      </Card>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 3: KEY SPACE
// ══════════════════════════════════════════════════════════════

function KeySpaceSection() {
  return (
    <>
      <SectionDivider number="3" title="Key Space" />

      <Card title="Key Structure Overview" color={C.text}>
        <P>
          Every key in PBT is <S>256 bits</S> and encodes semantic segments: the{" "}
          <S c={C.structural}>zone prefix</S> (which data category), address-derived hash bits
          (identifying the Ethereum account), a <S>path segment</S> (which item within the account),
          and a <S c={C.structural}>sub-index</S> (position within a stem group of 256 leaves).
          Storage keys additionally include an address prefix for account locality.
        </P>
      </Card>

      <Card title="Zone 000 — Account Headers" color={C.account}>
        <P>
          Each Ethereum account occupies a single <S c={C.structural}>header stem</S> in zone 000,
          following the <S c={C.account}>EIP-7864 layout</S>. The stem holds up to{" "}
          <S>194 populated leaves</S>: account metadata, the first 64 storage slots, and the first
          128 code chunks — all co-located under one 248-bit prefix. The{" "}
          <S c={C.account}>245-bit address hash</S> provides 2¹²²·⁵ birthday resistance.
        </P>
        <KeyLayoutBar
          segments={[
            { label: "zone", bits: 3, color: C.dim, value: "000" },
            { label: "H(addr)", bits: 245, color: C.account, value: "H(addr)[:245]" },
            { label: "sub_idx", bits: 8, color: C.structural, value: "0x00–0xFF" },
          ]}
          total={256}
        />
        <div style={{ background: "#0F172A", borderRadius: 8, padding: "16px 20px", fontFamily: font.mono, fontSize: 11, lineHeight: 1.8, marginTop: 14, marginBottom: 14 }}>
          <div style={{ color: C.dim, marginBottom: 8 }}>Sub-index layout (EIP-7864):</div>
          <div style={{ color: C.muted }}>0x00:       <span style={{ color: C.text }}>BASIC_DATA</span> <span style={{ color: C.dim }}>(version, code_size, nonce, balance)</span></div>
          <div style={{ color: C.muted }}>0x01:       <span style={{ color: C.text }}>CODE_HASH</span></div>
          <div style={{ color: C.muted }}>0x02–0x3F:  <span style={{ color: C.dim }}>reserved (62 slots, future use)</span></div>
          <div style={{ color: C.muted }}>0x40–0x7F:  <span style={{ color: C.storage }}>storage slots 0–63</span> <span style={{ color: C.dim }}>(hot storage)</span></div>
          <div style={{ color: C.muted }}>0x80–0xFF:  <span style={{ color: C.code }}>code chunks 0–127</span> <span style={{ color: C.dim }}>(first ~4 KB of bytecode)</span></div>
        </div>
        <P style={{ marginTop: 14 }}>
          <S>BASIC_DATA packing (32 bytes):</S>
        </P>
        <div style={{ background: "#0F172A", borderRadius: 8, padding: "16px 20px", fontFamily: font.mono, fontSize: 11, lineHeight: 1.8, marginBottom: 14 }}>
          <div style={{ color: C.muted }}>version:   <span style={{ color: C.text }}>1 byte</span></div>
          <div style={{ color: C.muted }}>reserved:  <span style={{ color: C.text }}>4 bytes</span> <span style={{ color: C.dim }}>(future use)</span></div>
          <div style={{ color: C.muted }}>code_size: <span style={{ color: C.text }}>3 bytes</span> <span style={{ color: C.dim }}>(max 16,777,215 bytes ≈ 16 MB)</span></div>
          <div style={{ color: C.muted }}>nonce:     <span style={{ color: C.text }}>8 bytes</span></div>
          <div style={{ color: C.muted }}>balance:   <span style={{ color: C.text }}>16 bytes</span></div>
          <div style={{ color: C.dim, borderTop: `1px solid ${C.cardBorder}`, marginTop: 8, paddingTop: 8 }}>total: 32 bytes</div>
        </div>
        <P>
          The 3-byte <Code>code_size</Code> supports contract sizes up to <S c={C.success}>16 MB</S> —
          orders of magnitude beyond any foreseeable contract size limit (current mainnet: 24 KB,
          Glamsterdam: 40 KB). The 4 bytes of reserved space are available for future protocol
          fields (epoch counters, flags, etc.).
        </P>
        <P>
          The header stem packs account metadata, <S c={C.storage}>hot storage</S>, and{" "}
          <S c={C.code}>initial code</S> into a single stem of up to 194 leaves. All share the
          248-bit prefix <Code>000 || H(addr)[:245]</Code> and differ only in the last 8 bits
          (sub_index). Proving an account's nonce, balance, and first few storage slots requires
          opening only one stem — maximizing proof sharing for the most common access patterns.
        </P>
        <P>
          128 code chunks × 31 bytes = <S c={C.code}>~4 KB of per-account code</S>. This covers
          the majority of deployed contracts by count. Contracts larger than ~4 KB store their
          remaining chunks in the content-addressed code zone (zone 001).
        </P>
        <P>
          64 storage slots × 32 bytes = <S c={C.storage}>2 KB of hot storage</S>. Slots 0–63
          are the most accessed in typical contracts (ERC-20 balances, ownership, reentrancy guards).
          Slots ≥64 are stored in the storage zone (zone 1).
        </P>
      </Card>

      <Card title="Zone 001 — Code Chunks (Content-Addressed)" color={C.code}>
        <P>
          Code chunks beyond the first 128 (which live in the account header stem) are stored in zone 001
          using <S c={C.code}>content-addressed keys</S>. The stem path is derived from{" "}
          <Code>code_hash</Code> (keccak256 of the full bytecode) and <Code>tree_index</Code>,
          so contracts with identical bytecode <S>share code zone leaves</S> — deduplicating storage
          for thousands of identical ERC-20 contracts from the same factory.
        </P>
        <KeyLayoutBar
          segments={[
            { label: "zone", bits: 3, color: C.dim, value: "001" },
            { label: "H(code_hash||idx)", bits: 245, color: C.code, value: "H(code_hash || tree_index)[:245]" },
            { label: "sub_idx", bits: 8, color: C.structural, value: "(chunk_id − 128) % 256" },
          ]}
          total={256}
        />
        <P style={{ fontSize: 13, marginTop: 14 }}>
          <Code>tree_index = (chunk_id − 128) // 256</Code>. The header stem covers chunks 0–127.
          With Glamsterdam's 40 KB limit: ~1,290 total chunks. Header covers 0–127, code zone covers
          128–1,289: tree_index ∈ {"{0, 1, 2, 3, 4}"}. Sequential chunks share stems: chunks 128–383
          share one stem, 384–639 another.
        </P>
        <P style={{ fontSize: 13 }}>
          <S c={C.structural}>Collision security:</S>{" "}
          <Code>H(code_hash || tree_index)[:245]</Code> provides <S c={C.success}>2¹²²·⁵ birthday
          resistance</S> between any two distinct (code_hash, tree_index) pairs. Since code_hash is
          keccak256(bytecode), a 256-bit uniform output, truncation to 245 bits preserves uniformity.
          A collision would require finding two distinct bytecodes whose hashed (code_hash, tree_index)
          pairs match in 245 bits — computationally infeasible.
        </P>
        <P style={{ fontSize: 13 }}>
          <S c={C.structural}>Why 8 bits for sub_index?</S> The{" "}
          <Code>sub_index = (chunk_id − 128) % 256</Code> groups up to 256 consecutive chunks under
          the same stem node. Each stem covers ~8 KB of bytecode (256 × 31-byte chunks). This is
          the same 8-bit stem width used in all zones for consistency. Sequential code execution
          naturally reads consecutive chunks within a stem.
        </P>
        <Callout type="warn">
          <S c={C.structural}>Hybrid dedup — per-account header + content-addressed overflow.</S>{" "}
          The first 128 code chunks live in the account header stem (zone 000, sub_idx 0x80–0xFF),
          keyed per-account. These are trivially expirable with the account. Chunks 128+ live in zone
          001 with content-addressed keys — shared across all contracts with the same bytecode.
          Deletion of content-addressed code requires reference counting (how many live accounts share
          this code_hash?) or permanent storage. Since SELFDESTRUCT is deprecated and most contracts
          fit within the 128-chunk header, the practical impact is limited.
        </Callout>
      </Card>

      <Card title="Zone 1 — Storage Slots" color={C.storage}>
        <P>
          Storage slots ≥64 are stored in zone 1 (slots 0–63 live in the account header stem in zone
          000). Storage keys are <S c={C.storage}>256 bits</S> — the same width as all other zones.
          The key uses a <S c={C.storage}>60-bit address prefix</S> for account-local grouping,
          followed by a <S c={C.storage}>187-bit stem suffix</S> derived from both the address and
          tree_index. Storage slots are adversarially addressable (any contract can write to any slot
          key), so the stem suffix must resist birthday attacks — 187 bits provides 2⁹³·⁵ birthday
          resistance.
        </P>
        <KeyLayoutBar
          segments={[
            { label: "zone", bits: 1, color: C.dim, value: "1" },
            { label: "addr_prefix", bits: 60, color: C.account, value: "H(addr)[:60]" },
            { label: "stem_suffix", bits: 187, color: C.storage, value: "H(addr || tree_index)[:187]" },
            { label: "sub_idx", bits: 8, color: C.structural, value: "slot_key % 256" },
          ]}
          total={256}
        />
        <P style={{ fontSize: 13, marginTop: 14 }}>
          <Code>tree_index = slot_key // 256</Code> (32-byte big-endian integer division).
          Slots 64–255 share the first zone 1 stem (tree_index = 0, sub_idx 64–255),
          slots 256–511 share a stem, etc. Stem co-location is deterministic — adjacent slots
          always group together. Slots 0–63 are accessed from the account header stem (zone 000,
          sub_idx 0x40–0x7F) without ever touching zone 1.
        </P>

        <Card title="Sparse Key Space in a Non-Sparse Trie" color={C.text}>
          <P>
            In practice, even the largest Ethereum contracts use only a few thousand storage slots.
            The useful information in the stem suffix is maybe 10–15 bits of entropy. Yet we allocate
            187 bits. Most of this key space will never contain leaves.
          </P>
          <P>
            <S c={C.success}>This is not a problem</S> — and it is exactly how Ethereum's current
            Merkle Patricia Trie already works. In the MPT, storage keys are{" "}
            <Code>keccak256(slot_key)</Code> — a full 256-bit hash. A typical contract uses fewer
            than 1,000 of the 2²⁵⁶ possible slots. The hexary Patricia trie adapts: it only creates
            nodes where keys actually diverge, resulting in ~3–4 levels of branching (log₁₆(1000) ≈ 2.5),
            not the theoretical maximum of 64 levels.
          </P>
          <P>
            PBT's non-sparse binary trie behaves identically. A contract with 1,000 storage slots
            produces ~10 levels of branching below the per-account bucket boundary (log₂(1000) ≈ 10).
            Empty regions of the key space create <S>no nodes, no storage overhead, and no proof
            overhead</S>. The wide key space exists solely to provide cryptographic collision
            resistance — the same function it serves in today's MPT, but made explicit.
          </P>
          <div style={{ background: "#0F172A", borderRadius: 8, padding: "16px 20px", fontFamily: font.mono, fontSize: 11, lineHeight: 1.8, marginTop: 14 }}>
            <div style={{ color: C.dim, marginBottom: 8 }}>Practical proof depth for a contract with N slots:</div>
            <div style={{ color: C.muted }}>N = 100 slots    → ~7 levels below bucket boundary</div>
            <div style={{ color: C.muted }}>N = 1,000 slots  → ~10 levels</div>
            <div style={{ color: C.muted }}>N = 10,000 slots → ~13 levels</div>
            <div style={{ color: C.muted }}>N = 100,000 slots → ~17 levels</div>
            <div style={{ color: C.dim, marginTop: 8 }}>These numbers depend on actual leaf count, not key width.</div>
            <div style={{ color: C.dim }}>The theoretical max (187 levels) is unreachable — it would require</div>
            <div style={{ color: C.dim }}>a single contract with 2¹⁸⁷ storage slots, which is physically impossible.</div>
          </div>
        </Card>

        <Card title="Address Prefix Locality (P=60)" color={C.account}>
          <P>
            The 60-bit <S c={C.account}>address prefix</S> creates a soft per-account bucket boundary
            at depth 61 in the storage zone (1-bit zone prefix + 60-bit prefix). For the vast majority
            of accounts, this bucket contains exactly one account's storage — providing de facto
            per-account grouping.
          </P>
          <P>
            <S c={C.structural}>Prefix collisions are not consensus-fatal.</S> At 10 billion accounts,
            the expected number of address pairs sharing a 60-bit prefix is ~43. These accounts would
            share a bucket in the tree, meaning their storage leaves are interleaved below depth 61.
            This is benign — the accounts' data remains distinguishable via the stem suffix{" "}
            <Code>H(addr || tree_index)</Code>, which binds each stem to both the address and the
            slot index. Two accounts sharing a bucket simply have slightly reduced parallelism at
            that bucket boundary.
          </P>
          <P>
            <S c={C.structural}>Why H(addr || tree_index)?</S> The stem suffix hashes the address
            together with the tree_index, not just the tree_index alone. This ensures that two
            different accounts sharing the same 60-bit prefix produce independent stem suffixes —
            there is no structural correlation between their storage layouts. An attacker who finds
            a prefix collision gains no ability to predict or influence the victim's storage key
            positions within the shared bucket.
          </P>
        </Card>
      </Card>

      <Card title="Key Derivation Across Zones" color={C.account}>
        <P>
          Each zone uses a different amount of address-derived bits, tailored to its threat model
          and structural needs:
        </P>
        <P>
          <S c={C.account}>Account zone (000):</S> <Code>H(addr)[:245]</Code> — the full hash (minus
          zone prefix and sub_index) provides maximum collision resistance at 2¹²²·⁵ birthday bound.
          The header stem holds up to 194 leaves (BASIC_DATA, CODE_HASH, 64 storage slots, 128 code
          chunks), all sharing the same 248-bit prefix.
        </P>
        <P>
          <S c={C.code}>Code zone (001):</S> <Code>H(code_hash || tree_index)[:245]</Code> —
          content-addressed stems with 2¹²²·⁵ birthday resistance. No per-account boundary in the
          code zone; per-account code locality is provided by the first 128 chunks in the header
          stem (zone 000). Contracts with identical bytecode share code zone leaves.
        </P>
        <P>
          <S c={C.storage}>Storage zone (1):</S> <Code>H(addr)[:60]</Code> prefix +{" "}
          <Code>H(addr || tree_index)[:187]</Code> suffix — a 60-bit prefix creates a soft
          per-account bucket at depth 61. The 187-bit suffix is bound to both address and slot index,
          providing 2⁹³·⁵ birthday resistance within each bucket. This design fits storage's unique
          requirements: many adversarially-chosen slots per account, with account-local grouping that
          doesn't require extended key width.
        </P>
      </Card>

      <Card title="Uniform 256-Bit Keys" color={C.structural}>
        <P>
          All zones use <S c={C.structural}>256-bit keys</S>. There is no variable-width complexity.
          Each zone achieves its security and structural goals within the same 256-bit envelope:
        </P>
        <P>
          <S c={C.storage}>Storage achieves collision resistance</S> via a 187-bit stem suffix (birthday
          2⁹³·⁵) within 256 bits. The key structure uses H(addr || tree_index) to bind each stem to both
          the address and slot index, preventing cross-account structural correlation.
        </P>
        <P>
          <S c={C.account}>Account locality</S> in the storage zone is achieved via a 60-bit address
          prefix, providing soft per-account grouping without extending key width. At 10B accounts,
          ~43 address pairs share a prefix — benign because prefix collisions affect only grouping,
          not data integrity.
        </P>
        <P>
          <S c={C.code}>Code chunks</S> use content-addressed keys:{" "}
          <Code>H(code_hash || tree_index)[:245]</Code> provides 2¹²²·⁵ birthday resistance and
          enables bytecode deduplication. Account headers use 245 bits of address hash for maximum
          per-account collision resistance (birthday 2¹²²·⁵).
        </P>
        <Callout type="success">
          <S c={C.success}>Key derivation is invisible to smart contracts.</S> The EVM operates
          on 256-bit logical slot numbers via <Code>SSTORE</Code>/<Code>SLOAD</Code> — it never
          sees tree keys. The entire key derivation happens inside the Ethereum client, below the
          EVM layer. No contract, Solidity code, or Yul assembly needs to change. This is the same
          abstraction boundary that exists today: the MPT internally hashes every storage slot
          through <Code>keccak256(slot_key)</Code> to produce a 256-bit trie path, and every account
          address through <Code>keccak256(address)</Code> — yet no contract is aware of this
          transformation. PBT simply replaces what happens behind that boundary.
        </Callout>
      </Card>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 4: TOPOLOGY
// ══════════════════════════════════════════════════════════════

function TopologySection() {
  return (
    <>
      <SectionDivider number="4" title="Tree Topology & Structural Boundaries" />

      <Card title="Structural Depth Map" color={C.structural}>
        <P>
          The key derivation creates <S c={C.structural}>deterministic structural boundaries</S> at
          known depths. Any implementation or protocol can compute the exact depth of a per-account
          subtree root, a stem node, or a zone root without inspecting the tree.
        </P>
        <div style={{ fontFamily: font.mono, fontSize: 11, marginTop: 14 }}>
          {[
            { depth: "1", desc: "Binary split: non-storage (left) vs all storage (right)", detail: "Root children", color: C.text },
            { depth: "2", desc: "Accounts+code (00*) vs reserved (01*)", detail: "Second level", color: C.dim },
            { depth: "3", desc: "Account zone root (000) vs code zone root (001)", detail: "Zone roots", color: C.account },
            { depth: "61", desc: "Soft per-account bucket boundary in storage zone", detail: "1 + 60", color: C.storage },
            { depth: "248", desc: "Stem level in all zones", detail: "256 − 8", color: C.structural },
            { depth: "256", desc: "Leaf level in all zones", detail: "All leaves", color: C.text },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr auto", alignItems: "center", borderBottom: `1px solid ${C.cardBorder}`, padding: "8px 0" }}>
              <div style={{ color: row.color, fontWeight: 700 }}>d={row.depth}</div>
              <div style={{ color: C.muted, fontSize: 11 }}>{row.desc}</div>
              <div style={{ color: C.dim, fontSize: 10, textAlign: "right" }}>{row.detail}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Per-Account Subtrees" color={C.structural}>
        <P>
          Per-account boundaries differ by zone, reflecting each zone's structure:
        </P>
        <P>
          <S c={C.code}>Code zone (001):</S> No per-account structural boundary. The code zone uses
          content-addressed keys — <Code>H(code_hash || tree_index)[:245]</Code> — so stems are
          organized by bytecode content, not by account. Per-account code locality is provided by the
          first 128 code chunks in the account header stem (zone 000, sub_idx 0x80–0xFF). Code zone
          leaves for a given bytecode are shared across all contracts with that bytecode.
        </P>
        <P>
          <S c={C.storage}>Storage zone (1):</S> Probabilistic per-account grouping at depth 61 (1-bit
          zone prefix + 60-bit address prefix). For the vast majority of accounts, the node at path{" "}
          <Code>1 || H(addr)[:60]</Code> roots exactly one account's storage. For the ~43 collision
          pairs expected at 10B accounts, two accounts share a bucket — their data is interleaved
          below depth 61 but remains distinguishable via the stem suffix.
        </P>
        <P>
          <S c={C.account}>Account zone (000):</S> Each account's header stem holds up to 194 leaves
          (BASIC_DATA, CODE_HASH, 64 storage slots, 128 code chunks). All share the 248-bit prefix{" "}
          <Code>000 || H(addr)[:245]</Code> and form a single stem. This is the primary per-account
          structural boundary in PBT.
        </P>
        <Callout type="success">
          These boundaries enable per-account state expiry, VOPS (Valid-only Partial Statelessness),
          and archival pruning: protocols can reference subtree roots at known depths as cryptographic
          commitments, without needing a separate data structure. The header stem provides per-account
          co-location of metadata, hot storage, and initial code. The storage zone provides
          probabilistic per-account grouping at depth 61, sufficient for the vast majority of accounts.
        </Callout>
      </Card>

      <Card title="Full Tree Visualization" color={C.text}>
        <svg viewBox="0 0 720 500" style={{ width: "100%", background: "#080C14", borderRadius: 8 }}>
          <text x={360} y={20} textAnchor="middle" fill={C.text} fontSize={11} fontWeight="700" fontFamily={font.mono}>
            PARTITIONED BINARY TREE — FULL TOPOLOGY
          </text>

          {/* Root */}
          <circle cx={360} cy={50} r={11} fill={C.bg} stroke={C.text} strokeWidth={2} />
          <text x={360} y={54} textAnchor="middle" fill={C.text} fontSize={7} fontFamily={font.mono} fontWeight="700">ROOT</text>

          {/* d=1 */}
          <line x1={360} y1={61} x2={200} y2={98} stroke={C.dim} strokeWidth={1.5} />
          <line x1={360} y1={61} x2={560} y2={98} stroke={C.storage} strokeWidth={2.5} />
          <text x={22} y={108} fill={C.structural} fontSize={7} fontFamily={font.mono} fontWeight="700">d=1</text>

          <circle cx={200} cy={105} r={8} fill={C.bg} stroke={C.dim} strokeWidth={1.5} />
          <text x={200} y={109} textAnchor="middle" fill={C.dim} fontSize={7} fontFamily={font.mono}>0</text>

          <circle cx={560} cy={105} r={13} fill={C.storageDim + "50"} stroke={C.storage} strokeWidth={2} />
          <text x={560} y={109} textAnchor="middle" fill={C.storage} fontSize={9} fontFamily={font.mono} fontWeight="800">1</text>
          <text x={560} y={130} textAnchor="middle" fill={C.storage} fontSize={8} fontFamily={font.mono} fontWeight="600">STORAGE</text>

          {/* d=2: 00 and 01 (reserved) */}
          <line x1={200} y1={113} x2={130} y2={155} stroke={C.dim} strokeWidth={1.5} />
          <line x1={200} y1={113} x2={280} y2={155} stroke={C.dim} strokeWidth={1} strokeDasharray="4,3" />
          <text x={22} y={165} fill={C.structural} fontSize={7} fontFamily={font.mono} fontWeight="700">d=2</text>

          <circle cx={130} cy={162} r={8} fill={C.bg} stroke={C.dim} strokeWidth={1.5} />
          <text x={130} y={166} textAnchor="middle" fill={C.dim} fontSize={6} fontFamily={font.mono} fontWeight="700">00</text>

          <circle cx={280} cy={162} r={8} fill={C.bg} stroke={C.dim} strokeWidth={1} strokeDasharray="3,2" />
          <text x={280} y={166} textAnchor="middle" fill={C.dim} fontSize={6} fontFamily={font.mono}>01</text>
          <text x={280} y={182} textAnchor="middle" fill={C.dim} fontSize={6.5} fontFamily={font.mono}>Reserved</text>

          {/* d=3: 000 (accounts) and 001 (code) */}
          <line x1={130} y1={170} x2={75} y2={215} stroke={C.account} strokeWidth={1.5} />
          <line x1={130} y1={170} x2={190} y2={215} stroke={C.code} strokeWidth={1.5} />
          <text x={22} y={225} fill={C.structural} fontSize={7} fontFamily={font.mono} fontWeight="700">d=3</text>

          <circle cx={75} cy={222} r={9} fill={C.accountDim + "40"} stroke={C.account} strokeWidth={1.5} />
          <text x={75} y={226} textAnchor="middle" fill={C.account} fontSize={6} fontFamily={font.mono} fontWeight="700">000</text>
          <text x={75} y={242} textAnchor="middle" fill={C.account} fontSize={7} fontFamily={font.mono}>Accounts</text>

          <circle cx={190} cy={222} r={9} fill={C.codeDim + "40"} stroke={C.code} strokeWidth={1.5} />
          <text x={190} y={226} textAnchor="middle" fill={C.code} fontSize={6} fontFamily={font.mono} fontWeight="700">001</text>
          <text x={190} y={242} textAnchor="middle" fill={C.code} fontSize={7} fontFamily={font.mono}>Code</text>

          {/* Content-addressed stems in code zone (no per-account split) */}
          <line x1={190} y1={231} x2={165} y2={302} stroke={C.code} strokeWidth={0.8} strokeDasharray="3,2" />
          <line x1={190} y1={231} x2={200} y2={302} stroke={C.code} strokeWidth={0.8} strokeDasharray="3,2" />
          <line x1={190} y1={231} x2={215} y2={302} stroke={C.code} strokeWidth={0.8} strokeDasharray="3,2" />
          <text x={190} y={268} textAnchor="middle" fill={C.code} fontSize={5.5} fontFamily={font.mono} opacity={0.6}>content-addressed</text>

          <rect x={153} y={302} width={24} height={10} rx={2} fill={C.code + "15"} stroke={C.code} strokeWidth={0.7} />
          <text x={165} y={310} textAnchor="middle" fill={C.code} fontSize={5} fontFamily={font.mono}>stem</text>
          <rect x={188} y={302} width={24} height={10} rx={2} fill={C.code + "15"} stroke={C.code} strokeWidth={0.7} />
          <text x={200} y={310} textAnchor="middle" fill={C.code} fontSize={5} fontFamily={font.mono}>stem</text>
          <rect x={203} y={302} width={24} height={10} rx={2} fill={C.code + "15"} stroke={C.code} strokeWidth={0.7} />
          <text x={215} y={310} textAnchor="middle" fill={C.code} fontSize={5} fontFamily={font.mono}>stem</text>

          {/* Account zone stems (direct from zone root to stems) */}
          <line x1={75} y1={231} x2={50} y2={302} stroke={C.account} strokeWidth={0.8} strokeDasharray="3,2" />
          <line x1={75} y1={231} x2={100} y2={302} stroke={C.account} strokeWidth={0.8} strokeDasharray="3,2" />
          <rect x={38} y={302} width={24} height={10} rx={2} fill={C.account + "15"} stroke={C.account} strokeWidth={0.7} />
          <text x={50} y={310} textAnchor="middle" fill={C.account} fontSize={5} fontFamily={font.mono}>stem</text>
          <rect x={88} y={302} width={24} height={10} rx={2} fill={C.account + "15"} stroke={C.account} strokeWidth={0.7} />
          <text x={100} y={310} textAnchor="middle" fill={C.account} fontSize={5} fontFamily={font.mono}>stem</text>

          <text x={22} y={310} fill={C.dim} fontSize={6} fontFamily={font.mono}>d=248</text>
          <text x={22} y={335} fill={C.dim} fontSize={6} fontFamily={font.mono}>d=256</text>

          {[40, 47, 54, 90, 97, 104].map((x, i) => (
            <rect key={`a${i}`} x={x} y={325} width={5} height={5} rx={1} fill={C.account} opacity={0.5} />
          ))}
          {[155, 161, 167, 190, 196, 202, 207, 213, 219].map((x, i) => (
            <rect key={`c${i}`} x={x} y={325} width={5} height={5} rx={1} fill={C.code} opacity={0.5} />
          ))}

          {/* Storage detail — d=61 bucket boundary */}
          <line x1={560} y1={118} x2={470} y2={165} stroke={C.storage} strokeWidth={1} strokeDasharray="3,2" />
          <line x1={560} y1={118} x2={650} y2={165} stroke={C.storage} strokeWidth={1} strokeDasharray="3,2" />

          <text x={395} y={178} fill={C.structural} fontSize={7} fontFamily={font.mono}>d=61</text>

          <circle cx={470} cy={175} r={6} fill={C.storage + "30"} stroke={C.storage} strokeWidth={1} />
          <text x={470} y={178} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>A</text>
          <circle cx={530} cy={175} r={6} fill={C.storage + "30"} stroke={C.storage} strokeWidth={1} />
          <text x={530} y={178} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>B</text>
          <circle cx={590} cy={175} r={6} fill={C.storage + "30"} stroke={C.storage} strokeWidth={1} />
          <text x={590} y={178} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>C</text>
          <circle cx={650} cy={175} r={6} fill={C.storage + "30"} stroke={C.storage} strokeWidth={1} />
          <text x={650} y={178} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>D</text>

          <line x1={470} y1={181} x2={455} y2={210} stroke={C.storage} strokeWidth={0.5} opacity={0.4} />
          <line x1={470} y1={181} x2={485} y2={210} stroke={C.storage} strokeWidth={0.5} opacity={0.4} />
          <text x={470} y={240} textAnchor="middle" fill={C.storage} fontSize={12} fontFamily={font.mono}>⋮</text>
          <text x={470} y={258} textAnchor="middle" fill={C.dim} fontSize={6.5} fontFamily={font.mono}>187-bit stem suffix</text>

          <text x={395} y={280} fill={C.dim} fontSize={6} fontFamily={font.mono}>d=248</text>
          <rect x={443} y={273} width={22} height={10} rx={2} fill={C.storage + "15"} stroke={C.storage} strokeWidth={0.7} />
          <text x={454} y={281} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>stem</text>
          <rect x={471} y={273} width={22} height={10} rx={2} fill={C.storage + "15"} stroke={C.storage} strokeWidth={0.7} />
          <text x={482} y={281} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>stem</text>

          <text x={395} y={303} fill={C.dim} fontSize={6} fontFamily={font.mono}>d=256</text>
          {[445, 450, 455, 460, 473, 478, 483, 488].map((x, i) => (
            <rect key={`s${i}`} x={x} y={295} width={4} height={4} rx={1} fill={C.storage} opacity={0.5} />
          ))}

          {/* Structural boundary box */}
          <rect x={440} y={160} width={75} height={150} rx={4} fill="none" stroke={C.structural} strokeWidth={1} strokeDasharray="4,3" opacity={0.4} />
          <text x={477} y={323} textAnchor="middle" fill={C.structural} fontSize={6.5} fontFamily={font.mono}>per-acct bucket</text>

          {/* Key insight */}
          <rect x={50} y={365} width={620} height={55} rx={8} fill="#0F172A" stroke={C.structural + "40"} strokeWidth={1} />
          <text x={70} y={387} fill={C.structural} fontSize={10} fontWeight="700" fontFamily={font.mono}>STRUCTURAL BOUNDARIES ARE INTRINSIC TO THE TOPOLOGY</text>
          <text x={70} y={405} fill={C.muted} fontSize={9} fontFamily={font.mono}>Header stem: 194 leaves per account. Code zone: content-addressed dedup. Storage: buckets at d=61. All zones: 256-bit keys.</text>

          {/* Legend */}
          <rect x={50} y={435} width={620} height={40} rx={8} fill="#0F172A" stroke={C.cardBorder} strokeWidth={1} />
          {[
            { x: 70, color: C.account, label: "Zone 000 — Accounts (256b)" },
            { x: 265, color: C.code, label: "Zone 001 — Code (256b)" },
            { x: 445, color: C.storage, label: "Zone 1 — Storage (256b)" },
          ].map((item, i) => (
            <g key={i}>
              <circle cx={item.x} cy={455} r={4} fill={item.color} />
              <text x={item.x + 10} y={459} fill={C.muted} fontSize={8.5} fontFamily={font.mono}>{item.label}</text>
            </g>
          ))}
        </svg>
      </Card>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 5: ROOT COMPUTATION
// ══════════════════════════════════════════════════════════════

function RootComputationSection() {
  return (
    <>
      <SectionDivider number="5" title="Root Computation: No Sequential Dependency" />

      <Card title="The Problem PBT Solves" color={C.danger}>
        <P>
          In Ethereum's current Merkle Patricia Trie (MPT), an account's leaf value is:
        </P>
        <CodeBlock>{`account_trie[hash(address)] = RLP(nonce, balance, storage_root, code_hash)`}</CodeBlock>
        <P>
          The <Code>storage_root</Code> field is the root hash of a <S c={C.danger}>separate trie</S> containing
          that account's storage. This creates a <S c={C.danger}>sequential dependency</S>: you cannot
          finalize the account trie leaf (and thus the state root) until you have computed the
          storage trie root. The storage root is an <S c={C.danger}>input</S> to the account leaf value.
        </P>
        <CodeBlock title="MPT: sequential dependency">{`Step 1: Update A's storage trie → compute storage_root_A
        ↓ MUST FINISH FIRST
Step 2: Update account trie with new storage_root_A → compute state_root
        ↓ DEPENDS ON STEP 1`}</CodeBlock>
      </Card>

      <Card title="How PBT Eliminates the Dependency" color={C.success}>
        <P>
          In PBT, the account header leaf in zone 000 contains:
        </P>
        <CodeBlock>{`basic_data  = [version(1) | reserved(4) | code_size(3) | nonce(8) | balance(16)]
code_hash   = keccak256(bytecode)`}</CodeBlock>
        <P>
          Notice what is <S c={C.success}>not there</S>: <Code>storage_root</Code>. No leaf value
          anywhere in the tree contains a hash computed from another part of the tree. Every leaf
          value is <S>self-contained data</S> — a nonce is just a nonce, a slot value is just a
          slot value.
        </P>
        <P>
          When a block modifies account A's nonce (zone 000) and storage slot 5 (zone 1), these are
          two independent leaf updates in the same tree. Neither leaf's value depends on the other.
          Root recomputation is a <S c={C.success}>single bottom-up pass</S>:
        </P>
        <CodeBlock title="PBT: single-pass root computation">{`1. Apply all leaf modifications (any order, or in parallel)
2. Recompute hashes bottom-up from modified leaves to root
3. Done — one pass, one root

The zone 000 branch and zone 1 branch propagate upward
INDEPENDENTLY and meet at the root.`}</CodeBlock>
        <Callout type="success">
          The per-account bucket boundary (depth 61 in storage) is an <S c={C.success}>intermediate hash</S> —
          a side-effect of the bottom-up pass, not an input to any other computation. Protocols can
          read it as a useful commitment, but it never constrains computation order.
        </Callout>
      </Card>

      <Card title="Parallelism Properties" color={C.text}>
        <P>
          <S>Zone-level parallelism:</S> The zone 000 (accounts) and zone 1 (storage) subtrees can be
          updated by separate threads. They share no data dependencies until their hashes merge near
          the root.
        </P>
        <P>
          <S>Account-level parallelism within zones:</S> Different accounts' subtrees within the
          same zone are independent. Updating account A's storage and account B's storage can
          proceed in parallel — they occupy disjoint subtrees below the bucket boundary.
        </P>
        <P>
          <S>Stem-level parallelism:</S> Within a single account's subtree, different stems are
          independent sub-computations that can be hashed in parallel.
        </P>
      </Card>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 6: STEMS
// ══════════════════════════════════════════════════════════════

function StemSection() {
  return (
    <>
      <SectionDivider number="6" title="Stems & Co-location" />

      <Card title="What Is a Stem?" color={C.structural}>
        <P>
          A <S c={C.structural}>stem</S> is a group of up to 256 leaves that share every bit of
          their key except the last 8 (the sub_index). In the tree, a stem corresponds to a
          subtree of depth 8 rooted at the node where the common prefix ends.
        </P>
        <P>
          The stem concept enables <S>proof compression</S>: when proving multiple values that
          share a stem, the Merkle branch from root to stem node is shared. Only the individual
          8-level openings within the stem differ. For <Code>k</Code> values in the same stem at
          effective branch depth <Code>d</Code>:
        </P>
        <div style={{ background: "#0F172A", borderRadius: 8, padding: "16px 20px", fontFamily: font.mono, fontSize: 12, lineHeight: 1.8, marginBottom: 14 }}>
          <div style={{ color: C.muted }}><span style={{ color: C.danger }}>Independent proofs:</span> k × d sibling hashes</div>
          <div style={{ color: C.muted }}><span style={{ color: C.success }}>Stem-batched proof:</span> d + 8k − 8 sibling hashes</div>
          <div style={{ color: C.dim, marginTop: 8 }}>k=4, d=13:  52 → 37 sibling hashes (<span style={{ color: C.success }}>29% savings</span>)</div>
          <div style={{ color: C.dim }}>k=10, d=13: 130 → 85 sibling hashes (<span style={{ color: C.success }}>35% savings</span>)</div>
          <div style={{ color: C.dim }}>k=16, d=15: 240 → 135 sibling hashes (<span style={{ color: C.success }}>44% savings</span>)</div>
        </div>
      </Card>

      <Card title="Stem Co-location by Design" color={C.storage}>
        <P>
          In zone 1 (storage), stems are formed by the <Code>tree_index = slot_key // 256</Code> derivation.
          This means slots 0–255 always share a stem, slots 256–511 share a stem, etc. This is
          <S c={C.storage}> deterministic, not hash-dependent</S>.
        </P>
        <svg viewBox="0 0 700 220" style={{ width: "100%", background: "#080C14", borderRadius: 8 }}>
          <text x={350} y={20} textAnchor="middle" fill={C.text} fontSize={10} fontWeight="700" fontFamily={font.mono}>
            STEM CO-LOCATION: ADJACENT SLOTS SHARE STEMS
          </text>

          <rect x={275} y={42} width={150} height={24} rx={6} fill={C.storage + "20"} stroke={C.storage} strokeWidth={1.5} />
          <text x={350} y={58} textAnchor="middle" fill={C.storage} fontSize={8.5} fontFamily={font.mono} fontWeight="700">
            stem₀: H(addr || 0)[:187]
          </text>

          {[...Array(16)].map((_, i) => {
            const x = 80 + i * 37;
            const hl = i < 4;
            return (
              <g key={i}>
                <line x1={350} y1={66} x2={x} y2={98} stroke={hl ? C.storage : C.dim} strokeWidth={hl ? 1 : 0.4} opacity={hl ? 0.8 : 0.25} />
                <rect x={x - 8} y={98} width={16} height={14} rx={3} fill={hl ? C.storage + "25" : C.dim + "10"} stroke={hl ? C.storage : C.dim} strokeWidth={0.7} />
                <text x={x} y={108} textAnchor="middle" fill={hl ? C.storage : C.dim} fontSize={6} fontFamily={font.mono}>{i}</text>
              </g>
            );
          })}
          <text x={99} y={128} textAnchor="middle" fill={C.storage} fontSize={7} fontFamily={font.mono}>slot 0</text>
          <text x={136} y={128} textAnchor="middle" fill={C.storage} fontSize={7} fontFamily={font.mono}>slot 1</text>
          <text x={173} y={128} textAnchor="middle" fill={C.storage} fontSize={7} fontFamily={font.mono}>slot 2</text>
          <text x={585} y={128} textAnchor="middle" fill={C.dim} fontSize={7} fontFamily={font.mono}>slot 255</text>

          <rect x={275} y={152} width={150} height={24} rx={6} fill={C.accent + "20"} stroke={C.accent} strokeWidth={1.5} />
          <text x={350} y={168} textAnchor="middle" fill={C.accent} fontSize={8.5} fontFamily={font.mono} fontWeight="700">
            stem₁: H(addr || 1)[:187]
          </text>

          {[...Array(6)].map((_, i) => {
            const x = 180 + i * 56;
            return (
              <g key={i}>
                <line x1={350} y1={176} x2={x} y2={196} stroke={C.accent} strokeWidth={0.4} opacity={0.3} />
                <rect x={x - 8} y={196} width={16} height={10} rx={2} fill={C.accent + "10"} stroke={C.accent} strokeWidth={0.5} opacity={0.5} />
              </g>
            );
          })}
          <text x={180} y={220} textAnchor="middle" fill={C.accent} fontSize={7} fontFamily={font.mono}>slot 256</text>
          <text x={460} y={220} textAnchor="middle" fill={C.dim} fontSize={7} fontFamily={font.mono}>slot 511</text>
        </svg>
        <P style={{ marginTop: 14 }}>
          This co-location is valuable because common contract patterns (mappings, arrays, sequential
          storage) access nearby slots together. ERC-20 balances stored in consecutive mapping slots
          naturally share a stem.
        </P>
      </Card>

      <Card title="Stems Per Zone" color={C.text}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {[
            { zone: "000", color: C.account, title: "Account Headers", depth: "248", items: "up to 194 values per stem", note: "EIP-7864 layout: BASIC_DATA, CODE_HASH, 64 storage slots (0x40–0x7F), 128 code chunks (0x80–0xFF). Hot paths — balance check + first storage slots — are co-located in one stem." },
            { zone: "001", color: C.code, title: "Code Chunks", depth: "248", items: "256 chunks per stem", note: "Content-addressed: chunks from identical bytecodes share stems. Each stem holds 256 consecutive chunks (~8 KB). Only populated for contracts with >128 chunks (>~4 KB)." },
            { zone: "1", color: C.storage, title: "Storage Slots", depth: "248", items: "256 slots per stem", note: "Adjacent slots share stems by design. High value for mapping-heavy contracts. Slots 0–63 are in the header stem (zone 000); slots 64+ are in zone 1." },
          ].map((z, i) => (
            <div key={i} style={{ background: "#0F172A", border: `1px solid ${z.color}30`, borderRadius: 8, padding: "16px 18px" }}>
              <div style={{ fontFamily: font.mono, fontSize: 11, color: z.color, fontWeight: 700, marginBottom: 8 }}>ZONE {z.zone} — {z.title}</div>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, lineHeight: 1.7, marginBottom: 6 }}>
                <div>Stem depth: <span style={{ color: C.structural }}>d={z.depth}</span></div>
                <div>Grouping: <span style={{ color: C.text }}>{z.items}</span></div>
              </div>
              <div style={{ fontFamily: font.sans, fontSize: 11, color: C.dim, lineHeight: 1.6 }}>{z.note}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 7: STATE EXPIRY
// ══════════════════════════════════════════════════════════════

function StateExpirySection() {
  return (
    <>
      <SectionDivider number="7" title="State Expiry & Partial Statefulness" />

      <Card title="Per-Account Subtree Expiry" color={C.structural}>
        <P>
          PBT's structural boundaries enable <S c={C.structural}>per-account subtree pruning</S> as a
          natural state expiry mechanism, with different granularity per zone:
        </P>
        <P>
          <S c={C.code}>Code zone:</S> Content-addressed code zone leaves are potentially shared across
          contracts with identical bytecode. Expiry requires reference counting (how many live accounts
          share this code_hash?) or permanent storage. The first 128 code chunks in the header stem
          (zone 000) expire naturally with the account — no reference counting needed.
        </P>
        <P>
          <S c={C.storage}>Storage zone:</S> Bucket-level expiry at depth 61 (1-bit zone prefix + 60-bit
          address prefix). The node at path <Code>1 || H(addr)[:60]</Code> is the bucket boundary.
          For the vast majority of accounts, this bucket contains exactly one account's storage. Record
          the subtree hash and prune below depth 61.
        </P>
        <P>
          <S c={C.account}>Account zone:</S> Per-account expiry at the stem level. The header stem holds
          up to 194 leaves (BASIC_DATA, CODE_HASH, 64 storage slots, 128 code chunks). Expiry of the
          entire header stem removes the account's core data, hot storage, and initial code in one
          operation.
        </P>
        <P>
          To <S>resurrect</S> expired data, a client provides a proof consistent with the recorded
          commitment stub. The subtree is re-attached at its original position.
        </P>
        <Callout type="info">
          Expiry granularity is per-account, per-zone. You can expire account A's storage while keeping
          A's account header (zone 000) and code (zone 001) live. For the ~43 address pairs that share
          a storage bucket at 10B accounts, bucket-level expiry would affect both accounts. Mitigation
          options include finer-grained expiry within the bucket, or accepting this as a rare edge case.
        </Callout>
      </Card>

      <Card title="Support for Partial-Statefulness & VOPS" color={C.account}>
        <P>
          PBT's zone structure directly enables <S c={C.account}>partial statefulness</S> — a mode
          where a node stores the complete account trie (zone 000) but only syncs and maintains
          storage and code for a configured subset of contracts. This is the architecture behind
          EIP-7928 (Block Access Lists), where a partial state node reduces disk usage from ~640 GB
          to ~59 GB by skipping untracked contracts' storage entirely.
        </P>
        <P>
          In PBT, this maps cleanly onto the zone topology. Zone 000 (all account headers) is the
          subtree at prefix "000" — a self-contained subtree that can be synced independently.
          A partial node downloads zone 000 in full, giving it complete account data (balances, nonces,
          code hashes, hot storage, and initial code) for every address. For tracked contracts, it
          additionally syncs their code zone stems (by code_hash) and storage subtrees in zone 1.
          For untracked contracts, zones 001 and 1 are simply never fetched.
        </P>
        <P>
          Within the storage zone, a partial node can restrict scope to specific accounts by syncing
          only the subtrees below their prefix at depth 61. This gives fine-grained control: a node
          tracking 100 "hot" contracts downloads only those 100 storage subtrees, not the millions
          of inactive ones. For code, syncing is by code_hash — the node fetches the relevant
          content-addressed stems for each tracked contract's bytecode.
        </P>
        <P>
          Block-by-block state updates for partial nodes come via <S c={C.structural}>Block Access
          Lists (BALs)</S> — per-block diffs specifying which storage slots changed and to what values.
          A partial node applies BAL diffs directly to the trie for tracked contracts without
          re-executing transactions, then verifies the resulting state root against the block header.
          PBT's single-pass root computation (no sequential dependency) means this verification is
          straightforward: apply leaf updates, recompute bottom-up, compare root.
        </P>
        <P>
          This architecture also serves as the foundation for <S c={C.structural}>Valid-only Partial
          Statelessness (VOPS)</S>: validators that store only a portion of the state can still
          validate blocks by verifying witness proofs for the portions they don't hold. PBT's
          structural boundaries make it possible to define precisely which subtrees a validator holds
          (per-account, per-zone, or any combination) and to verify proofs against the subtree roots
          at known depths.
        </P>
      </Card>

      <Card title="Archival Pruning" color={C.text}>
        <P>
          Archival nodes can selectively prune cold storage on a per-account basis. Identify accounts
          whose storage has not been accessed for N epochs. For each, record the bucket root
          at depth 61 in the storage zone and prune the subtree. The archival node retains zone 000
          (header stems, including initial code and hot storage) plus the commitment stubs. Code zone
          stems are retained only for bytecodes referenced by live accounts.
        </P>
        <P>
          This allows an archival node to serve balance/nonce/code queries for all accounts while
          offloading cold storage to dedicated archive providers. The commitment stubs ensure that
          the archival node can verify storage proofs provided by archive providers without trusting them.
        </P>
      </Card>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 8: PRIVACY
// ══════════════════════════════════════════════════════════════

function PrivacySection() {
  return (
    <>
      <SectionDivider number="8" title="Privacy: Wormholes & Wider Identifiers" />

      <Card title="The 160-Bit Bottleneck" color={C.accent}>
        <P>
          <S c={C.accent}>EIP-7503 (zero-knowledge wormholes)</S> proposes plausibly deniable privacy
          for Ethereum: users "burn" ETH by sending it to a cryptographically unspendable address,
          then present a zero-knowledge proof to re-mint the funds in a fresh account. The burn
          transaction looks like a normal transfer — no interaction with a privacy contract is visible
          on-chain.
        </P>
        <P>
          The fundamental problem is Ethereum's <S c={C.danger}>160-bit address space</S>. A burn
          address is derived as <Code>trunc_160(H("worm" || secret))</Code>. The birthday paradox
          means an attacker can find two secrets <Code>s₁, s₂</Code> producing the same 160-bit
          address in approximately <S c={C.danger}>2⁸⁰ operations</S> — within reach of nation-states.
          With such a collision, the attacker deposits once and mints twice with different nullifiers:
          an infinite inflation bug.
        </P>
        <P>
          Worse, even "fixing" the nullifier scheme doesn't help. An attacker can find{" "}
          <Code>s₁, s₂</Code> such that <Code>trunc_160(H("worm" || s₁)) == trunc_160(H(skToPk(s₂)))</Code>,
          producing a burn address that is also spendable via a regular private key. This is the
          same 2⁸⁰ collision search. As the original analysis concludes: plausibly deniable wormholes
          require collision resistance that 160-bit addresses cannot provide.
        </P>
      </Card>

      <Card title="How PBT's 245-Bit Account Keys Help" color={C.account}>
        <P>
          PBT's <S c={C.account}>245-bit account key</S> (in zone 000) raises the birthday bound from
          2⁸⁰ to <S c={C.success}>2¹²²·⁵</S>. The difference is categorical: 2⁸⁰ is attackable by
          nation-states today; 2¹²²·⁵ is computationally infeasible by a very wide margin, even
          accounting for foreseeable advances in hardware.
        </P>
        <P>
          The critical question is <S>where</S> the wormhole identity lives. In EIP-7503's current
          design, the burn identity is a 160-bit Ethereum address — constrained by the transaction
          format, not by the tree. PBT does not change this surface constraint. However, PBT creates
          infrastructure that a <S c={C.structural}>protocol-level wormhole</S> could leverage:
        </P>
        <P>
          <S c={C.structural}>Enshrined burn at the tree level.</S> If the protocol natively
          understands PBT's key structure, a burn operation could target a 245-bit account key
          directly — bypassing the 160-bit address bottleneck entirely. The burn identity
          would be <Code>H(H("worm" || secret))[:245]</Code>,
          a 245-bit value with birthday resistance of 2¹²²·⁵. A BASIC_DATA leaf (sub_idx 0x00)
          would exist at this key in zone 000, holding the burned balance. The minting proof
          would demonstrate knowledge of a secret whose derived key maps to an existing
          balance in the tree.
        </P>
        <P>
          This sidesteps the fundamental tension identified in the wormhole analysis: the collision
          resistance needed for security is provided by the wider identifier, while plausible
          deniability is preserved because the burn still creates an ordinary-looking account
          entry in the tree — indistinguishable from any other account key derived from a regular
          address.
        </P>
      </Card>

      <Card title="Practical Considerations" color={C.text}>
        <P>
          <S c={C.structural}>What PBT enables vs. what it solves.</S> PBT does not implement
          wormholes. It provides the <S>structural precondition</S> — a wide enough identifier
          space with collision resistance above the security threshold. Several open problems remain
          for a complete wormhole design:
        </P>
        <P>
          <S c={C.text}>Anonymity set.</S> EIP-7503 currently exposes a beacon_block_root as public
          input, shrinking the anonymity set to transactions in a single block. A tree-level design
          could prove against a state root (committing to all accounts), potentially expanding the
          anonymity set to all accounts satisfying a predicate at a given block — but this requires
          efficient proof generation over PBT's Merkle structure.
        </P>
        <P>
          <S c={C.text}>Hash function alignment.</S> If PBT uses a SNARK-friendly hash (e.g.,
          Poseidon2), the wormhole proof — which must demonstrate a valid path through the tree —
          becomes dramatically cheaper to generate. The hash function choice in §10 (Open Questions)
          has direct implications for wormhole feasibility.
        </P>
        <P>
          <S c={C.text}>Beacon deposit integration.</S> A complementary approach uses private
          beacon chain deposits as the wormhole mechanism. With ~33% of ETH staked and tens of
          millions in daily withdrawals, the anonymity set is large. PBT's structural boundaries
          could help here too: the deposit's tree footprint is a well-defined subtree that proofs
          can reference.
        </P>
      </Card>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 9: SECURITY
// ══════════════════════════════════════════════════════════════

function SecuritySection() {
  return (
    <>
      <SectionDivider number="9" title="Security Analysis" />

      <Card title="Collision Resistance" color={C.danger}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontFamily: font.mono, fontSize: 11, borderCollapse: "collapse", lineHeight: 1.7 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.cardBorder}` }}>
                {["Field", "Bits", "Birthday Bound", "Threat Model", "Assessment"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: C.dim, fontWeight: 600, fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { f: "account key (zone 000)", b: "245", bd: "2¹²²·⁵", threat: "Two addresses → same key prefix", assessment: "Excellent", color: C.success },
                { f: "addr_prefix (storage)", b: "60", bd: "~43 pairs at 10B", threat: "Two addresses → same bucket", assessment: "Not consensus-fatal", color: C.text },
                { f: "stem_suffix (storage)", b: "187", bd: "2⁹³·⁵", threat: "Two tree_indexes → same stem", assessment: "Future-proof for decades", color: C.success },
                { f: "storage effective", b: "195", bd: "2⁹⁷·⁵", threat: "Full key collision within bucket", assessment: "Excellent", color: C.success },
                { f: "code stem (code zone)", b: "245", bd: "2¹²²·⁵", threat: "Two (code_hash, tree_index) → same stem", assessment: "Excellent", color: C.success },
                { f: "sub_index", b: "8", bd: "n/a", threat: "Direct mapping, not hashed", assessment: "Collision impossible*", color: C.text },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                  <td style={{ padding: "10px 12px", color: C.text }}>{row.f}</td>
                  <td style={{ padding: "10px 12px", color: row.color }}>{row.b}</td>
                  <td style={{ padding: "10px 12px", color: row.color }}>{row.bd}</td>
                  <td style={{ padding: "10px 12px", color: C.muted, fontSize: 10 }}>{row.threat}</td>
                  <td style={{ padding: "10px 12px", color: row.color, fontWeight: 600, fontSize: 10 }}>{row.assessment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P style={{ fontSize: 11, marginTop: 14, marginBottom: 0 }}>
          * <Code>sub_index = slot_key % 256</Code>. Two distinct slot keys collide in sub_index only if
          they share the same tree_index AND the same remainder — meaning they are the same slot.
          Collision is logically impossible between distinct keys.
        </P>
      </Card>

      <Card title="Content-Addressed Code: Collision Resistance" color={C.code}>
        <P>
          Code zone keys are derived as <Code>H(code_hash || tree_index)[:245]</Code>, where
          code_hash = keccak256(bytecode). The 245-bit truncation provides{" "}
          <S c={C.success}>2¹²²·⁵ birthday resistance</S> between any two distinct (code_hash,
          tree_index) pairs. Since code_hash is a keccak256 output (256 uniformly distributed bits),
          truncation preserves uniformity. Two distinct bytecodes mapping to the same stem key is
          computationally infeasible. Contracts with identical bytecode intentionally share stems —
          this is the deduplication mechanism, not a collision.
        </P>
      </Card>

      <Card title="Cross-Account Isolation" color={C.text}>
        <P>
          <S c={C.code}>Code zone:</S> Content-addressed — contracts with identical bytecode intentionally
          share code zone leaves. Contracts with different bytecodes are isolated by 245-bit{" "}
          <Code>H(code_hash || tree_index)</Code> with 2¹²²·⁵ birthday resistance. Per-account code
          isolation for the first 128 chunks is provided by the header stem in zone 000.
        </P>
        <P>
          <S c={C.storage}>Storage zone:</S> Isolation is probabilistic via the 60-bit address prefix.
          The ~43 expected collision pairs at 10B accounts share a bucket, meaning their storage leaves
          are interleaved below depth 61. This is <S>not consensus-fatal</S> — the stem suffix{" "}
          <Code>H(addr || tree_index)</Code> ensures each account's stems are independent. Two accounts
          sharing a bucket can coexist, with slightly reduced parallelism at the bucket boundary. An
          attacker cannot exploit a prefix collision to corrupt another account's storage.
        </P>
      </Card>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 10: OPEN QUESTIONS
// ══════════════════════════════════════════════════════════════

function QuestionsSection() {
  return (
    <>
      <SectionDivider number="10" title="Open Questions" />
      <Card color={C.structural}>
        {[
          {
            q: "Optimal storage prefix length (P)",
            detail: "P=60 provides ~43 collision pairs at 10B accounts — is this the right tradeoff? Increasing P strengthens per-account isolation but reduces stem suffix bits. P=64 would give ~2.7 collision pairs at 10B accounts but reduce stem suffix to 183 bits (birthday 2⁹¹·⁵). P=48 would give ~700K collision pairs — likely too many. The choice depends on how much bucket sharing is tolerable."
          },
          {
            q: "Resurrection strategy for expired subtrees",
            detail: "When a storage bucket is expired to a commitment stub at depth 61, how does resurrection work? Options include: (A) full subtree re-provision with a Merkle proof against the stub, (B) incremental resurrection where individual slots are re-proved on access, (C) epoch-based resurrection with bulk re-attachment. Each has different bandwidth and latency tradeoffs."
          },
          {
            q: "Hash function selection",
            detail: "PBT is hash-function agnostic. The choice affects proving performance (SNARK/STARK friendliness), hashing speed (native execution), and proof compactness. Candidates: BLAKE3 (fast native), Poseidon2 (SNARK-friendly), Keccak (ecosystem compatibility). The tree structure is independent of this choice."
          },
          {
            q: "Cross-zone multi-proof format",
            detail: "Proving both an account header (zone 000) and a storage slot (zone 1) for the same account requires two Merkle branches. These share the first ~1 level (from root to the depth-1 split). Defining a compact multi-proof format that exploits this sharing needs specification."
          },
          {
            q: "Reference counting for content-addressed code",
            detail: "When a contract is destroyed, its header stem (including first 128 code chunks) is deleted. But code zone stems (zone 001) may be shared with other contracts via content-addressing. Options: (A) reference counting per code_hash — track how many live accounts use each bytecode, (B) never delete code zone stems — since SELFDESTRUCT is deprecated, dead code stays until a state expiry sweep, (C) garbage collection during state expiry — periodically scan for unreferenced code_hash entries. Option B is simplest and may be sufficient given that most contracts fit within the 128-chunk header."
          },
          {
            q: "Header stem sub-index constants",
            detail: "The EIP-7864 header layout embeds specific sub-index boundaries into the protocol: 0x40 for first storage slot, 0x80 for first code chunk. These constants determine how many hot storage slots (64) and initial code chunks (128) are per-account vs zone-separated. Should these be configurable per-fork, or fixed permanently? Changing them would require migrating all account header stems."
          },
          {
            q: "Bucket collision handling for state expiry",
            detail: "When two accounts share a 60-bit storage prefix (~43 pairs at 10B accounts), bucket-level expiry at depth 61 would expire both accounts' storage together. Should the protocol handle this explicitly (e.g., check for sharing before expiring), accept it as a rare edge case, or use finer-grained expiry within shared buckets?"
          },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: i < 5 ? 22 : 0 }}>
            <div style={{ fontFamily: font.mono, fontSize: 12, color: C.structural, fontWeight: 700, marginBottom: 6 }}>Q{i + 1}: {item.q}</div>
            <P style={{ marginBottom: 0 }}>{item.detail}</P>
          </div>
        ))}
      </Card>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════

export default function PBTSpec() {
  const [activeSection, setActiveSection] = useState("overview");

  const handleNav = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", padding: "32px 28px", fontFamily: font.sans }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 36, borderBottom: `1px solid ${C.cardBorder}`, paddingBottom: 24 }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, color: C.structural, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
            SPECIFICATION — DRAFT
          </div>
          <h1 style={{ fontFamily: font.mono, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 12px", lineHeight: 1.2, background: `linear-gradient(135deg, ${C.text}, ${C.structural})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Partitioned Binary Tree (PBT)
          </h1>
          <p style={{ fontFamily: font.sans, fontSize: 15, color: C.muted, margin: "0 0 16px", lineHeight: 1.65 }}>
            A zone-structured unified binary state tree for Ethereum with uniform 256-bit keys,
            structural per-account subtree boundaries, and future-proof collision resistance.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Zones", value: "000 / 001 / 1", sub: "acct / code / storage" },
              { label: "Header Stem", value: "194 leaves", sub: "EIP-7864 layout" },
              { label: "Code Zone", value: "dedup", sub: "content-addressed" },
              { label: "Root Computation", value: "Single pass", sub: "no sequential dependency" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#0F172A", borderRadius: 6, padding: "10px 14px", border: `1px solid ${C.cardBorder}` }}>
                <div style={{ fontFamily: font.mono, fontSize: 9, color: C.dim, letterSpacing: "0.05em", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: font.mono, fontSize: 14, color: C.text, fontWeight: 700 }}>{item.value}</div>
                <div style={{ fontFamily: font.mono, fontSize: 9, color: C.dim, marginTop: 2 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <Nav active={activeSection} onNav={handleNav} />

        <div id="overview"><OverviewSection /></div>
        <div id="zones"><ZoneSection /></div>
        <div id="keyspace"><KeySpaceSection /></div>
        <div id="topology"><TopologySection /></div>
        <div id="root"><RootComputationSection /></div>
        <div id="stems"><StemSection /></div>
        <div id="expiry"><StateExpirySection /></div>
        <div id="privacy"><PrivacySection /></div>
        <div id="security"><SecuritySection /></div>
        <div id="questions"><QuestionsSection /></div>
      </div>
    </div>
  );
}
