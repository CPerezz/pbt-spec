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
        <button key={s.id} onClick={() => onNav(s.id)} style={{ fontFamily: font.mono, fontSize: 10.5, padding: "6px 12px", borderRadius: 6, border: `1px solid ${active === s.id ? C.structural : C.cardBorder}`, background: active === s.id ? C.structuralDim + "40" : "transparent", color: active === s.id ? C.structural : C.dim, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.04em" }}>
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
          PBT uses <S>variable-width keys</S>: account and code keys are 256 bits, while storage
          keys are 418 bits. In a non-sparse trie, this costs nothing in proof size or storage —
          actual tree depth adapts to content density, not key width. The wider storage keys provide
          future-proof collision resistance against birthday attacks on the storage stem path.
        </P>
      </Card>

      <Card title="Design Goals" color={C.structural}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { title: "No Sequential Dependency", desc: "Root computation is a single bottom-up pass. No leaf value contains a hash of another part of the tree. Account headers do not store storage_root. Zones propagate upward independently.", color: C.success },
            { title: "Structural Semantics", desc: "The tree topology carries meaning. Zone boundaries, per-account subtree roots, and data categories are intrinsic to the tree structure — not just a property of the key derivation scheme, but of the tree itself.", color: C.structural },
            { title: "Future-Proof Security", desc: "220-bit account identifiers (birthday bound 2¹¹⁰). 189-bit storage stem paths (birthday bound 2⁹⁴·⁵). Designed to resist foreseeable advances in computational power over the coming decades.", color: C.danger },
            { title: "State Distribution Alignment", desc: "Storage gets 50% of the tree address space (1-bit zone prefix), reflecting its dominance in Ethereum state (~75%). Accounts and code share the remaining 50%. The non-sparse trie adapts naturally to actual population density.", color: C.storage },
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
          of every key and determines both the semantic meaning and the key width.
        </P>
        <P>
          Storage uses a <S c={C.storage}>1-bit prefix</S> ("1"), giving it 50% of the top-level
          tree address space. At depth 1, the right child of the root IS the root of all storage.
          Accounts ("00") and code ("01") use 2-bit prefixes, each occupying 25%.
        </P>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 18 }}>
          {[
            { zone: "00", label: "Account Headers", color: C.account, bits: "256", pct: "25%", prefix: "2-bit", contents: "Per-account nonce, balance, code_size (3 bytes, max 16 MB), and code_hash. Two sub-index values per account: BASIC_DATA and CODE_HASH. The remaining 26 bits between account_id and sub_index are zero-padded." },
            { zone: "01", label: "Code Chunks", color: C.code, bits: "256", pct: "25%", prefix: "2-bit", contents: "Contract bytecode split into fixed-size chunks. Keyed per-account so that each contract's code forms a distinct subtree. Sequential chunk_ids assigned at deploy time." },
            { zone: "1", label: "Contract Storage", color: C.storage, bits: "418", pct: "50%", prefix: "1-bit", contents: "All contract storage slots. Extended 418-bit keys with 189-bit stem paths provide future-proof collision resistance. The dominant data category in Ethereum state (~75%)." },
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
          <S c={C.account}>15% account headers</S>, and <S c={C.code}>10% code</S>. Allocating
          equal tree space to all data types would create an imbalanced tree where the storage subtree
          is significantly denser than the others.
        </P>
        <P>
          By giving storage a 1-bit prefix (50% of tree space), the tree is more balanced at the top
          levels. This reduces average proof depth for storage lookups — the most common operation — and
          creates a natural split at depth 1: left child = accounts and code, right child = all storage.
        </P>
        <Callout type="warn">
          <S c={C.structural}>Design note — why not 75% for storage?</S> One could give storage even more
          space (e.g., prefixes "1" + "01" = 75%, with accounts at "000" and code at "001"). However,
          this splits storage across two disjoint subtrees, which breaks the property that "all storage"
          is rooted at a single node (depth 1, right child). Per-account storage would need a rule to
          assign accounts to one subtree or the other, the zone prefix lengths become 1/2/3 bits,
          and per-account subtree depths would vary by zone (221 vs 222 vs 223). The complexity
          is not justified: in a non-sparse trie, the actual tree balance depends on leaf population,
          not address space allocation. The 50/25/25 split is the cleanest design that gives storage
          the majority share while preserving a single storage root.
        </Callout>
      </Card>

      <Card title="Top-Level Tree Topology" color={C.structural}>
        <svg viewBox="0 0 700 220" style={{ width: "100%", background: "#080C14", borderRadius: 8 }}>
          <circle cx={350} cy={35} r={12} fill={C.bg} stroke={C.text} strokeWidth={2} />
          <text x={350} y={39} textAnchor="middle" fill={C.text} fontSize={8} fontFamily={font.mono} fontWeight="700">ROOT</text>

          <line x1={350} y1={47} x2={175} y2={90} stroke={C.dim} strokeWidth={1.5} />
          <line x1={350} y1={47} x2={525} y2={90} stroke={C.storage} strokeWidth={2.5} />

          <text x={262} y={65} textAnchor="middle" fill={C.dim} fontSize={8} fontFamily={font.mono}>bit 0</text>
          <text x={440} y={65} textAnchor="middle" fill={C.storage} fontSize={8} fontFamily={font.mono}>bit 1</text>

          <text x={30} y={100} fill={C.structural} fontSize={8} fontFamily={font.mono} fontWeight="700">d=1</text>
          <line x1={50} y1={97} x2={155} y2={97} stroke={C.structural} strokeWidth={0.5} strokeDasharray="2,3" />

          <circle cx={175} cy={97} r={9} fill={C.bg} stroke={C.dim} strokeWidth={1.5} />
          <text x={175} y={101} textAnchor="middle" fill={C.dim} fontSize={7} fontFamily={font.mono} fontWeight="700">0_</text>

          <circle cx={525} cy={97} r={14} fill={C.storageDim + "50"} stroke={C.storage} strokeWidth={2} />
          <text x={525} y={101} textAnchor="middle" fill={C.storage} fontSize={9} fontFamily={font.mono} fontWeight="800">1</text>
          <text x={525} y={124} textAnchor="middle" fill={C.storage} fontSize={9} fontFamily={font.mono} fontWeight="600">ALL STORAGE</text>
          <text x={525} y={137} textAnchor="middle" fill={C.dim} fontSize={7.5} fontFamily={font.mono}>50% of tree address space</text>
          <text x={525} y={150} textAnchor="middle" fill={C.dim} fontSize={7.5} fontFamily={font.mono}>418-bit keys</text>

          <line x1={175} y1={106} x2={100} y2={155} stroke={C.account} strokeWidth={1.5} />
          <line x1={175} y1={106} x2={250} y2={155} stroke={C.code} strokeWidth={1.5} />

          <text x={30} y={165} fill={C.structural} fontSize={8} fontFamily={font.mono} fontWeight="700">d=2</text>
          <line x1={50} y1={162} x2={80} y2={162} stroke={C.structural} strokeWidth={0.5} strokeDasharray="2,3" />

          <circle cx={100} cy={162} r={11} fill={C.accountDim + "40"} stroke={C.account} strokeWidth={1.5} />
          <text x={100} y={166} textAnchor="middle" fill={C.account} fontSize={7} fontFamily={font.mono} fontWeight="700">00</text>
          <text x={100} y={186} textAnchor="middle" fill={C.account} fontSize={8} fontFamily={font.mono}>Accounts</text>
          <text x={100} y={199} textAnchor="middle" fill={C.dim} fontSize={7} fontFamily={font.mono}>25% • 256-bit keys</text>

          <circle cx={250} cy={162} r={11} fill={C.codeDim + "40"} stroke={C.code} strokeWidth={1.5} />
          <text x={250} y={166} textAnchor="middle" fill={C.code} fontSize={7} fontFamily={font.mono} fontWeight="700">01</text>
          <text x={250} y={186} textAnchor="middle" fill={C.code} fontSize={8} fontFamily={font.mono}>Code</text>
          <text x={250} y={199} textAnchor="middle" fill={C.dim} fontSize={7} fontFamily={font.mono}>25% • 256-bit keys</text>
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
          Every key in PBT encodes four semantic segments: the <S c={C.structural}>zone prefix</S> (which
          data category), the <S c={C.account}>account identifier</S> (which Ethereum account), a{" "}
          <S>path segment</S> (which item within the account), and a <S c={C.structural}>sub-index</S> (position
          within a stem group). The zone prefix determines both the key's total width and its
          interpretation.
        </P>
      </Card>

      <Card title="Zone 00 — Account Headers" color={C.account}>
        <P>
          Each Ethereum account has two leaf entries in zone 00: one for <Code>BASIC_DATA</Code> (packing
          version, code_size, nonce, and balance into a single 32-byte value) and one for <Code>CODE_HASH</Code>.
          The <S c={C.account}>220-bit account_id</S> is derived from hashing the 20-byte address, providing
          2¹¹⁰ birthday resistance.
        </P>
        <KeyLayoutBar
          segments={[
            { label: "zone", bits: 2, color: C.dim, value: "00" },
            { label: "account_id", bits: 220, color: C.account, value: "H('pbt:account' || addr)[:220]" },
            { label: "padding", bits: 26, color: "#334155", value: "0...0 (unused)" },
            { label: "sub_idx", bits: 8, color: C.structural, value: "0x00 | 0x01" },
          ]}
          total={256}
        />
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
          The 26 bits between account_id and sub_index are <S>zero-padded</S>. These bits are structurally
          unused — account headers need only two sub-index values. However, the two leaves still form
          a natural <S c={C.structural}>stem</S>: they share the entire prefix{" "}
          <Code>00 || account_id || zeros(26)</Code> and differ only in the last 8 bits. This means
          proving both BASIC_DATA and CODE_HASH for a single account shares the entire Merkle branch
          from root to the stem node — only the 8-level opening within the stem differs.
        </P>
        <Callout type="info">
          An alternative is to split BASIC_DATA into finer sub-indices (e.g., 0x00 = nonce, 0x01 = balance,
          0x02 = code_hash, 0x03 = code_size). This would use more stem slots but increase leaf count.
          The packed approach (2 leaves per account) is more storage-efficient and matches EIP-7864/6800.
        </Callout>
      </Card>

      <Card title="Zone 01 — Code Chunks" color={C.code}>
        <P>
          Contract bytecode is split into fixed-size chunks and stored individually. The{" "}
          <S c={C.code}>26-bit chunk_path</S> is the tree_index directly embedded as an integer. Code chunk_ids
          are sequential integers assigned at deploy time — they are <S>not adversarially chosen</S>,
          so the path requires no hashing and has zero collision probability.
        </P>
        <KeyLayoutBar
          segments={[
            { label: "zone", bits: 2, color: C.dim, value: "01" },
            { label: "account_id", bits: 220, color: C.account, value: "H('pbt:account' || addr)[:220]" },
            { label: "chunk_path", bits: 26, color: C.code, value: "uint26(tree_index)" },
            { label: "sub_idx", bits: 8, color: C.structural, value: "chunk_id % 256" },
          ]}
          total={256}
        />
        <P style={{ fontSize: 13, marginTop: 14 }}>
          <Code>tree_index = chunk_id // 256</Code>. With Glamsterdam's 40 KB limit: ~1,290 chunks → 
          tree_index ∈ {"{0, 1, 2, 3, 4, 5}"}. With a hypothetical future 256 KB limit: ~8,258 chunks → 
          ~32 tree_index values. Sequential chunks share stems: chunks 0–255 share one stem, 256–511 another.
        </P>
        <P style={{ fontSize: 13 }}>
          <S c={C.structural}>Collision security:</S> Unlike storage (where slot keys are adversarial and
          must be hashed), chunk_path is <S c={C.success}>directly embedded</S> as <Code>uint26(tree_index)</Code> — 
          no hash, no collision. The mapping is injective: different tree_index values always produce
          different chunk_paths. The 26-bit width (residual from 256 − 2 − 220 − 8) supports
          tree_index up to 2²⁶ ≈ 67M, meaning a single contract could hold ~512 GB of bytecode.
          Each contract has its own account_id prefix, so this limit is per-contract, not network-wide.
        </P>
        <P style={{ fontSize: 13 }}>
          <S c={C.structural}>Why 8 bits for sub_index?</S> The <Code>sub_index = chunk_id % 256</Code> is 
          the stem mechanism: it groups up to 256 consecutive chunks under the same stem node. Each stem 
          covers ~8 KB of bytecode (256 × 31-byte chunks). This is the same 8-bit stem width used in all 
          zones for consistency, matching EIP-7864/6800's design. Sequential code execution naturally reads 
          consecutive chunks within a stem — excellent co-location for proof batching.
        </P>
        <Callout type="warn">
          <S c={C.structural}>Design note — why include account_id in code keys?</S> An alternative is
          <S c={C.code}> content-addressed code</S>: derive the key from <Code>code_hash</Code> instead
          of the deploying address. This would deduplicate identical bytecode — thousands of identical
          ERC-20 contracts from the same factory would share one set of code chunks in the tree.
          However, this introduces complexity: deletion becomes a reference-counting problem (you can't
          remove code when one contract self-destructs if others share it), and you lose the per-account
          code subtree boundary that enables independent per-account code expiry. The per-account
          approach is simpler, consistent with EIP-7864, and preserves structural semantics.
          Content-addressed code deduplication remains a viable future optimization.
        </Callout>
      </Card>

      <Card title="Zone 1 — Storage Slots" color={C.storage}>
        <P>
          Storage keys are <S c={C.storage}>418 bits</S> — wider than the other zones. This is the
          core security decision: storage slots are adversarially addressable (any contract can write
          to any slot key, and an attacker who controls a contract can choose arbitrary slot keys),
          so the stem path must be wide enough to resist birthday attacks. The{" "}
          <S c={C.storage}>189-bit stem_path</S> provides 2⁹⁴·⁵ birthday resistance.
        </P>
        <KeyLayoutBar
          segments={[
            { label: "zone", bits: 1, color: C.dim, value: "1" },
            { label: "account_id", bits: 220, color: C.account, value: "H('pbt:account' || addr)[:220]" },
            { label: "stem_path", bits: 189, color: C.storage, value: "H('pbt:slot' || tree_index)[:189]" },
            { label: "sub_idx", bits: 8, color: C.structural, value: "slot_key % 256" },
          ]}
          total={418}
        />
        <P style={{ fontSize: 13, marginTop: 14 }}>
          <Code>tree_index = slot_key // 256</Code> (32-byte big-endian integer division).
          Slots 0–255 share a stem, 256–511 share a stem, etc. Stem co-location is
          deterministic — adjacent slots always group together.
        </P>

        <Card title="On The Apparent 'Waste' of 189-Bit Stem Paths" color={C.text}>
          <P>
            In practice, even the largest Ethereum contracts use only a few thousand storage slots.
            The useful information in the stem path is maybe 10–15 bits of entropy. Yet we allocate
            189 bits. Most of this key space will never contain leaves.
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
            produces ~10 levels of branching below the per-account subtree root (log₂(1000) ≈ 10),
            regardless of whether the stem path is 86 bits or 189 bits wide. Empty regions of the
            key space create <S>no nodes, no storage overhead, and no proof overhead</S>. The wide
            key space exists solely to provide cryptographic collision resistance — the same function
            it serves in today's MPT, but made explicit.
          </P>
          <div style={{ background: "#0F172A", borderRadius: 8, padding: "16px 20px", fontFamily: font.mono, fontSize: 11, lineHeight: 1.8, marginTop: 14 }}>
            <div style={{ color: C.dim, marginBottom: 8 }}>Practical proof depth for a contract with N slots:</div>
            <div style={{ color: C.muted }}>N = 100 slots    → ~7 levels below per-account root</div>
            <div style={{ color: C.muted }}>N = 1,000 slots  → ~10 levels</div>
            <div style={{ color: C.muted }}>N = 10,000 slots → ~13 levels</div>
            <div style={{ color: C.muted }}>N = 100,000 slots → ~17 levels</div>
            <div style={{ color: C.dim, marginTop: 8 }}>These numbers are identical whether stem_path is 86 bits or 189 bits.</div>
            <div style={{ color: C.dim }}>The theoretical max (189 levels) is unreachable — it would require</div>
            <div style={{ color: C.dim }}>a single contract with 2¹⁸⁹ storage slots, which is physically impossible.</div>
          </div>
        </Card>
      </Card>

      <Card title="The 220-Bit Account Identifier" color={C.account}>
        <P>
          The <S c={C.account}>account_id</S> is the first 220 bits of a domain-separated hash
          of the Ethereum address. It is used identically in all three zones, ensuring that every
          piece of data belonging to one account shares a common prefix within its zone.
        </P>
        <P>
          220 bits provides a <S c={C.success}>birthday bound of 2¹¹⁰</S> — a meaningful
          improvement over Ethereum's 160-bit address space (birthday 2⁸⁰). The account_id creates a{" "}
          <S c={C.structural}>per-account subtree boundary</S> at a deterministic depth in every zone.
          In zones 00 and 01, this boundary is at depth 222 (2-bit zone prefix + 220-bit account_id).
          In zone 1, it is at depth 221 (1-bit prefix + 220-bit account_id). Below this depth,
          all keys belong to the same account.
        </P>
      </Card>

      <Card title="Why Variable-Width Keys?" color={C.structural}>
        <P>
          The key width differs by zone: 256 bits for accounts and code, 418 bits for storage.
          This is a deliberate choice based on the <S c={C.structural}>threat model</S> of each zone.
        </P>
        <P>
          <S c={C.storage}>Storage slots are adversarially addressable.</S> Any contract can write to
          any slot key. An attacker who finds two slot keys that map to the same stem path can cause
          state corruption within that account. The stem path must be wide enough that birthday
          attacks are infeasible — 189 bits achieves this.
        </P>
        <P>
          <S c={C.code}>Code chunks are non-adversarial.</S> Chunk IDs are sequential integers determined
          by contract bytecode length at deploy time. The deployer cannot choose arbitrary chunk positions.
          The chunk_path is directly embedded as <Code>uint26(tree_index)</Code> — an injective mapping
          with zero collision probability.
        </P>
        <P>
          <S c={C.account}>Account headers have only two entries.</S> The sub_index (0x00 or 0x01) is
          a fixed enumeration, not a hash. The 26 bits between account_id and sub_index are zero-padded.
          There is no collision surface.
        </P>
        <Callout type="success">
          <S c={C.success}>Variable-width keys are invisible to smart contracts.</S> The EVM operates
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
            { depth: "2", desc: "Account zone root (prefix 00) and code zone root (prefix 01)", detail: "Zones 00, 01", color: C.account },
            { depth: "221", desc: "Per-account subtree root within the storage zone", detail: "1 + 220 = 221", color: C.storage },
            { depth: "222", desc: "Per-account subtree root within account and code zones", detail: "2 + 220 = 222", color: C.account },
            { depth: "248", desc: "Stem level in zones 00 and 01", detail: "256 − 8", color: C.dim },
            { depth: "256", desc: "Leaf level in zones 00 and 01", detail: "Account/code leaf", color: C.text },
            { depth: "410", desc: "Stem level in zone 1", detail: "418 − 8", color: C.storage },
            { depth: "418", desc: "Leaf level in zone 1", detail: "Storage leaf", color: C.storage },
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
          The most important structural property: within each zone, all data for a single Ethereum
          account lives under a <S c={C.structural}>single internal node</S> at a deterministic depth.
          This node is the root of that account's subtree within the zone.
        </P>
        <P>
          For account A in zone 1 (storage): the node at path <Code>1 || account_id_A</Code> (depth 221)
          is the root of ALL of A's storage slots. This is an <S c={C.structural}>intrinsic topological property</S> —
          it emerges from the key derivation, not from any explicit bookkeeping.
        </P>
        <P>
          The per-account subtree root's hash is computed as a side-effect of the bottom-up root
          computation. It is an <S>intermediate hash</S> in the Merkle path, never stored as a leaf
          value. It can be read (by any node that traverses the tree) but does not create a
          dependency for any other computation.
        </P>
        <Callout type="success">
          This is what enables per-account state expiry, VOPS (Valid-only Partial Statelessness),
          and archival pruning: a protocol can reference "the subtree root of account A's storage"
          as a first-class cryptographic commitment, without needing a separate data structure.
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
          <line x1={360} y1={61} x2={180} y2={98} stroke={C.dim} strokeWidth={1.5} />
          <line x1={360} y1={61} x2={545} y2={98} stroke={C.storage} strokeWidth={2.5} />
          <text x={22} y={108} fill={C.structural} fontSize={7} fontFamily={font.mono} fontWeight="700">d=1</text>

          <circle cx={180} cy={105} r={8} fill={C.bg} stroke={C.dim} strokeWidth={1.5} />
          <text x={180} y={109} textAnchor="middle" fill={C.dim} fontSize={7} fontFamily={font.mono}>0</text>

          <circle cx={545} cy={105} r={13} fill={C.storageDim + "50"} stroke={C.storage} strokeWidth={2} />
          <text x={545} y={109} textAnchor="middle" fill={C.storage} fontSize={9} fontFamily={font.mono} fontWeight="800">1</text>
          <text x={545} y={130} textAnchor="middle" fill={C.storage} fontSize={8} fontFamily={font.mono} fontWeight="600">STORAGE</text>

          {/* d=2 */}
          <line x1={180} y1={113} x2={100} y2={160} stroke={C.account} strokeWidth={1.5} />
          <line x1={180} y1={113} x2={260} y2={160} stroke={C.code} strokeWidth={1.5} />
          <text x={22} y={170} fill={C.structural} fontSize={7} fontFamily={font.mono} fontWeight="700">d=2</text>

          <circle cx={100} cy={167} r={10} fill={C.accountDim + "40"} stroke={C.account} strokeWidth={1.5} />
          <text x={100} y={171} textAnchor="middle" fill={C.account} fontSize={7} fontFamily={font.mono} fontWeight="700">00</text>
          <text x={100} y={190} textAnchor="middle" fill={C.account} fontSize={7.5} fontFamily={font.mono}>Accounts</text>

          <circle cx={260} cy={167} r={10} fill={C.codeDim + "40"} stroke={C.code} strokeWidth={1.5} />
          <text x={260} y={171} textAnchor="middle" fill={C.code} fontSize={7} fontFamily={font.mono} fontWeight="700">01</text>
          <text x={260} y={190} textAnchor="middle" fill={C.code} fontSize={7.5} fontFamily={font.mono}>Code</text>

          {/* Per-account in zone 00 */}
          <line x1={100} y1={177} x2={65} y2={225} stroke={C.account} strokeWidth={0.8} strokeDasharray="3,2" />
          <line x1={100} y1={177} x2={135} y2={225} stroke={C.account} strokeWidth={0.8} strokeDasharray="3,2" />
          <text x={22} y={237} fill={C.structural} fontSize={7} fontFamily={font.mono}>d=222</text>

          <circle cx={65} cy={232} r={5} fill={C.account + "30"} stroke={C.account} strokeWidth={1} />
          <text x={65} y={235} textAnchor="middle" fill={C.account} fontSize={5} fontFamily={font.mono}>A</text>
          <circle cx={135} cy={232} r={5} fill={C.account + "30"} stroke={C.account} strokeWidth={1} />
          <text x={135} y={235} textAnchor="middle" fill={C.account} fontSize={5} fontFamily={font.mono}>B</text>

          {/* Stems zone 00 */}
          <line x1={65} y1={237} x2={50} y2={263} stroke={C.account} strokeWidth={0.5} opacity={0.5} />
          <line x1={65} y1={237} x2={80} y2={263} stroke={C.account} strokeWidth={0.5} opacity={0.5} />
          <rect x={38} y={263} width={24} height={10} rx={2} fill={C.account + "15"} stroke={C.account} strokeWidth={0.7} />
          <text x={50} y={271} textAnchor="middle" fill={C.account} fontSize={5} fontFamily={font.mono}>stem</text>
          <rect x={68} y={263} width={24} height={10} rx={2} fill={C.account + "15"} stroke={C.account} strokeWidth={0.7} />
          <text x={80} y={271} textAnchor="middle" fill={C.account} fontSize={5} fontFamily={font.mono}>stem</text>

          <text x={22} y={271} fill={C.dim} fontSize={6} fontFamily={font.mono}>d=248</text>
          <text x={22} y={293} fill={C.dim} fontSize={6} fontFamily={font.mono}>d=256</text>

          {[40, 47, 54, 70, 77, 84].map((x, i) => (
            <rect key={`a${i}`} x={x} y={283} width={5} height={5} rx={1} fill={C.account} opacity={0.5} />
          ))}

          {/* Per-account in zone 01 */}
          <line x1={260} y1={177} x2={225} y2={225} stroke={C.code} strokeWidth={0.8} strokeDasharray="3,2" />
          <line x1={260} y1={177} x2={295} y2={225} stroke={C.code} strokeWidth={0.8} strokeDasharray="3,2" />

          <circle cx={225} cy={232} r={5} fill={C.code + "30"} stroke={C.code} strokeWidth={1} />
          <text x={225} y={235} textAnchor="middle" fill={C.code} fontSize={5} fontFamily={font.mono}>A</text>
          <circle cx={295} cy={232} r={5} fill={C.code + "30"} stroke={C.code} strokeWidth={1} />
          <text x={295} y={235} textAnchor="middle" fill={C.code} fontSize={5} fontFamily={font.mono}>B</text>

          <line x1={225} y1={237} x2={213} y2={263} stroke={C.code} strokeWidth={0.5} opacity={0.5} />
          <line x1={225} y1={237} x2={237} y2={263} stroke={C.code} strokeWidth={0.5} opacity={0.5} />
          <rect x={201} y={263} width={24} height={10} rx={2} fill={C.code + "15"} stroke={C.code} strokeWidth={0.7} />
          <text x={213} y={271} textAnchor="middle" fill={C.code} fontSize={5} fontFamily={font.mono}>stem</text>
          <rect x={225} y={263} width={24} height={10} rx={2} fill={C.code + "15"} stroke={C.code} strokeWidth={0.7} />
          <text x={237} y={271} textAnchor="middle" fill={C.code} fontSize={5} fontFamily={font.mono}>stem</text>

          {[203, 209, 215, 227, 233, 239].map((x, i) => (
            <rect key={`c${i}`} x={x} y={283} width={5} height={5} rx={1} fill={C.code} opacity={0.5} />
          ))}

          {/* Storage detail */}
          <line x1={545} y1={118} x2={445} y2={165} stroke={C.storage} strokeWidth={1} strokeDasharray="3,2" />
          <line x1={545} y1={118} x2={645} y2={165} stroke={C.storage} strokeWidth={1} strokeDasharray="3,2" />

          <text x={380} y={180} fill={C.structural} fontSize={7} fontFamily={font.mono}>d=221</text>

          <circle cx={445} cy={175} r={6} fill={C.storage + "30"} stroke={C.storage} strokeWidth={1} />
          <text x={445} y={178} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>A</text>
          <circle cx={510} cy={175} r={6} fill={C.storage + "30"} stroke={C.storage} strokeWidth={1} />
          <text x={510} y={178} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>B</text>
          <circle cx={580} cy={175} r={6} fill={C.storage + "30"} stroke={C.storage} strokeWidth={1} />
          <text x={580} y={178} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>C</text>
          <circle cx={645} cy={175} r={6} fill={C.storage + "30"} stroke={C.storage} strokeWidth={1} />
          <text x={645} y={178} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>D</text>

          <line x1={445} y1={181} x2={430} y2={205} stroke={C.storage} strokeWidth={0.5} opacity={0.4} />
          <line x1={445} y1={181} x2={460} y2={205} stroke={C.storage} strokeWidth={0.5} opacity={0.4} />
          <text x={445} y={230} textAnchor="middle" fill={C.storage} fontSize={12} fontFamily={font.mono}>⋮</text>
          <text x={445} y={248} textAnchor="middle" fill={C.dim} fontSize={6.5} fontFamily={font.mono}>189-bit stem path</text>

          <text x={380} y={273} fill={C.dim} fontSize={6} fontFamily={font.mono}>d=410</text>
          <rect x={418} y={266} width={22} height={10} rx={2} fill={C.storage + "15"} stroke={C.storage} strokeWidth={0.7} />
          <text x={429} y={274} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>stem</text>
          <rect x={446} y={266} width={22} height={10} rx={2} fill={C.storage + "15"} stroke={C.storage} strokeWidth={0.7} />
          <text x={457} y={274} textAnchor="middle" fill={C.storage} fontSize={5} fontFamily={font.mono}>stem</text>

          <text x={380} y={296} fill={C.dim} fontSize={6} fontFamily={font.mono}>d=418</text>
          {[420, 425, 430, 435, 448, 453, 458, 463].map((x, i) => (
            <rect key={`s${i}`} x={x} y={288} width={4} height={4} rx={1} fill={C.storage} opacity={0.5} />
          ))}

          {/* Structural boundary box */}
          <rect x={415} y={160} width={75} height={148} rx={4} fill="none" stroke={C.structural} strokeWidth={1} strokeDasharray="4,3" opacity={0.4} />
          <text x={452} y={320} textAnchor="middle" fill={C.structural} fontSize={6.5} fontFamily={font.mono}>per-acct subtree</text>

          {/* Key insight */}
          <rect x={50} y={345} width={620} height={55} rx={8} fill="#0F172A" stroke={C.structural + "40"} strokeWidth={1} />
          <text x={70} y={367} fill={C.structural} fontSize={10} fontWeight="700" fontFamily={font.mono}>STRUCTURAL BOUNDARIES ARE INTRINSIC TO THE TOPOLOGY</text>
          <text x={70} y={385} fill={C.muted} fontSize={9} fontFamily={font.mono}>Every internal node at depth 221 (storage) or 222 (account/code) roots exactly one account's data.</text>

          {/* Legend */}
          <rect x={50} y={415} width={620} height={40} rx={8} fill="#0F172A" stroke={C.cardBorder} strokeWidth={1} />
          {[
            { x: 70, color: C.account, label: "Zone 00 — Accounts (256b)" },
            { x: 260, color: C.code, label: "Zone 01 — Code (256b)" },
            { x: 440, color: C.storage, label: "Zone 1 — Storage (418b)" },
          ].map((item, i) => (
            <g key={i}>
              <circle cx={item.x} cy={435} r={4} fill={item.color} />
              <text x={item.x + 10} y={439} fill={C.muted} fontSize={8.5} fontFamily={font.mono}>{item.label}</text>
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
          In PBT, the account header leaf in zone 00 contains:
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
          When a block modifies account A's nonce (zone 00) and storage slot 5 (zone 1), these are
          two independent leaf updates in the same tree. Neither leaf's value depends on the other.
          Root recomputation is a <S c={C.success}>single bottom-up pass</S>:
        </P>
        <CodeBlock title="PBT: single-pass root computation">{`1. Apply all leaf modifications (any order, or in parallel)
2. Recompute hashes bottom-up from modified leaves to root
3. Done — one pass, one root

The zone 00 branch and zone 1 branch propagate upward
INDEPENDENTLY and meet at the root.`}</CodeBlock>
        <Callout type="success">
          The per-account subtree root at depth 221 (storage) is an <S c={C.success}>intermediate hash</S> —
          a side-effect of the bottom-up pass, not an input to any other computation. Protocols can
          read it as a useful commitment, but it never constrains computation order.
        </Callout>
      </Card>

      <Card title="Parallelism Properties" color={C.text}>
        <P>
          <S>Zone-level parallelism:</S> The zone 00 (accounts) and zone 1 (storage) subtrees can be
          updated by separate threads. They share no data dependencies until their hashes merge near
          the root.
        </P>
        <P>
          <S>Account-level parallelism within zones:</S> Different accounts' subtrees within the
          same zone are independent. Updating account A's storage and account B's storage can
          proceed in parallel — they occupy disjoint subtrees below depth 221.
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
            stem₀: H("pbt:slot" || 0)[:189]
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
            stem₁: H("pbt:slot" || 1)[:189]
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
            { zone: "00", color: C.account, title: "Account Headers", depth: "248", items: "2 values per stem", note: "BASIC_DATA and CODE_HASH form a stem naturally: they share all 248 prefix bits and differ only in sub_index. Proving both shares the entire branch to the stem node." },
            { zone: "01", color: C.code, title: "Code Chunks", depth: "248", items: "256 chunks per stem", note: "Sequential chunks co-locate naturally. Code execution reads consecutive chunks — excellent stem utilization for large contracts." },
            { zone: "1", color: C.storage, title: "Storage Slots", depth: "410", items: "256 slots per stem", note: "Adjacent slots share stems by design. High value for mapping-heavy contracts. Slots 0–255 (hot storage) always co-located." },
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
          natural state expiry mechanism. To expire an account's storage:
        </P>
        <P>
          1. Identify the per-account subtree root at depth 221 in zone 1 (the node at path{" "}
          <Code>1 || account_id</Code>).
        </P>
        <P>
          2. Record the subtree root hash as a <S>commitment stub</S>.
        </P>
        <P>
          3. Prune the entire subtree below that node. All of the account's storage slots are removed
          from the tree. The commitment stub remains, preserving the integrity of the Merkle path
          from root to that depth.
        </P>
        <P>
          To <S>resurrect</S> an expired account's storage, a client provides a proof that the data
          is consistent with the recorded commitment stub. The subtree is re-attached at its original
          position.
        </P>
        <Callout type="info">
          This expiry granularity is per-account, per-zone. You can expire account A's storage (zone 1)
          while keeping A's account header (zone 00) and code (zone 01) live. This is the right
          granularity: inactive storage is the dominant source of state growth.
        </Callout>
      </Card>

      <Card title="Support for Partial-Statefulness & VOPS" color={C.account}>
        <P>
          PBT's zone structure directly enables <S c={C.account}>partial statefulness</S> — a mode
          where a node stores the complete account trie (zone 00) but only syncs and maintains
          storage and code for a configured subset of contracts. This is the architecture behind
          EIP-7928 (Block Access Lists), where a partial state node reduces disk usage from ~640 GB
          to ~59 GB by skipping untracked contracts' storage entirely.
        </P>
        <P>
          In PBT, this maps cleanly onto the zone topology. Zone 00 (all account headers) is the
          left-left child of the root — a self-contained subtree that can be synced independently.
          A partial node downloads zone 00 in full, giving it complete account data (balances, nonces,
          code hashes) for every address. For tracked contracts, it additionally syncs their subtrees
          in zone 01 (code) and zone 1 (storage). For untracked contracts, zones 01 and 1 are simply
          never fetched.
        </P>
        <P>
          Within any zone, a partial node can further restrict scope to specific accounts by syncing
          only the subtrees below their account_id prefix at depth 222 (zones 00/01) or 221 (zone 1).
          This gives fine-grained control: a node tracking 100 "hot" contracts downloads only those
          100 storage subtrees, not the millions of inactive ones.
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
          whose storage has not been accessed for N epochs. For each, record the per-account subtree
          root at depth 221 (zone 1) and prune the subtree. The archival node retains zone 00 (headers)
          and zone 01 (code) in full, plus the commitment stubs.
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

      <Card title="How PBT's 220-Bit Account Identifiers Help" color={C.account}>
        <P>
          PBT's <S c={C.account}>220-bit account_id</S> raises the birthday bound from 2⁸⁰ to{" "}
          <S c={C.success}>2¹¹⁰</S>. The difference is categorical: 2⁸⁰ is attackable by
          nation-states today; 2¹¹⁰ is computationally infeasible by a very wide margin, even
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
          understands PBT's key structure, a burn operation could target a 220-bit account_id
          directly — bypassing the 160-bit address bottleneck entirely. The burn identity
          would be <Code>account_id = H("pbt:account" || H("worm" || secret))[:220]</Code>,
          a 220-bit value with birthday resistance of 2¹¹⁰. Two leaves (BASIC_DATA and CODE_HASH)
          would exist at this account_id in zone 00, holding the burned balance. The minting proof
          would demonstrate knowledge of a secret whose derived account_id maps to an existing
          balance in the tree.
        </P>
        <P>
          This sidesteps the fundamental tension identified in the wormhole analysis: the collision
          resistance needed for security is provided by the wider identifier, while plausible
          deniability is preserved because the burn still creates an ordinary-looking account
          entry in the tree — indistinguishable from any other account_id derived from a regular
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
                { f: "account_id", b: "220", bd: "2¹¹⁰", threat: "Two addresses → same prefix", assessment: "Excellent", color: C.success },
                { f: "stem_path (storage)", b: "189", bd: "2⁹⁴·⁵", threat: "Two tree_index → same stem", assessment: "Future-proof for decades", color: C.success },
                { f: "storage effective", b: "197", bd: "2⁹⁸·⁵", threat: "Full key collision within acct", assessment: "Excellent", color: C.success },
                { f: "chunk_path (code)", b: "26", bd: "n/a", threat: "Direct embedding, no hash", assessment: "Zero collision probability", color: C.success },
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

      <Card title="Code Chunk Path: Zero Collision by Design" color={C.code}>
        <P>
          Unlike storage (where adversarial slot keys require hashing), code chunk_paths use{" "}
          <S c={C.success}>direct embedding</S>: <Code>chunk_path = uint26(tree_index)</Code>. The mapping
          is injective — different tree_index values always produce different chunk_paths. Collision
          probability is exactly zero. The 26-bit width supports tree_index up to 2²⁶ ≈ 67M,
          meaning a single contract could hold ~512 GB of bytecode — far beyond any foreseeable limit.
        </P>
      </Card>

      <Card title="Cross-Account Isolation" color={C.text}>
        <P>
          A critical security property: collisions in stem_path <S>only matter within
          a single account's subtree</S>. Two different accounts having the same stem_path for different
          tree_index values is harmless — they occupy different subtrees separated by the
          account_id prefix. An attacker cannot use a collision in one account to affect another.
        </P>
        <P>
          The <S c={C.account}>220-bit account_id</S> provides the isolation boundary. Every Merkle branch
          that traverses from root into an account's subtree passes through the account_id prefix,
          ensuring that disjoint accounts never share tree nodes below depth 221/222.
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
            q: "Optimal account_id width",
            detail: "220 bits (birthday 2¹¹⁰) was chosen to balance account collision resistance with available bits in the 256-bit key format (2 bits zone + 220 bits account_id + 26 bits path/padding + 8 bits sub_index = 256). Widening to 230 (birthday 2¹¹⁵) reduces chunk_path to 16 bits — still collision-free (direct embedding), but limits per-contract code to ~512 KB (2¹⁶ × 256 × 31 bytes)."
          },
          {
            q: "Resurrection strategy for expired subtrees",
            detail: "When a per-account storage subtree is expired to a commitment stub, how does resurrection work? Options include: (A) full subtree re-provision with a Merkle proof against the stub, (B) incremental resurrection where individual slots are re-proved on access, (C) epoch-based resurrection with bulk re-attachment. Each has different bandwidth and latency tradeoffs."
          },
          {
            q: "Hash function selection",
            detail: "PBT is hash-function agnostic. The choice affects proving performance (SNARK/STARK friendliness), hashing speed (native execution), and proof compactness. Candidates: BLAKE3 (fast native), Poseidon2 (SNARK-friendly), Keccak (ecosystem compatibility). The tree structure is independent of this choice."
          },
          {
            q: "Impact of variable key width on SNARK/STARK circuits",
            detail: "Circuits verifying Merkle paths handle two key widths (256b and 418b). The zone prefix deterministically indicates which width applies — a single branch on one bit. Actual proof depth depends on tree population, not key width. Concrete benchmarks are needed to quantify the circuit-size overhead."
          },
          {
            q: "Cross-zone multi-proof format",
            detail: "Proving both an account header (zone 00) and a storage slot (zone 1) for the same account requires two Merkle branches of different depths. These share the first ~1 level (from root to the depth-1 split). Defining a compact multi-proof format that exploits this sharing needs specification."
          },
          {
            q: "Content-addressed code deduplication",
            detail: "Zone 01 currently keys code per-account (by address). An alternative is content-addressing by code_hash, which would deduplicate identical contracts. This trades per-account structural boundaries for storage efficiency. Worth exploring as a future optimization if state growth from duplicate code becomes significant."
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
            A zone-structured unified binary state tree for Ethereum with variable-width keys,
            structural per-account subtree boundaries, and future-proof collision resistance.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Zones", value: "00 / 01 / 1", sub: "acct / code / storage" },
              { label: "Account ID", value: "220 bits", sub: "birthday 2¹¹⁰" },
              { label: "Storage Keys", value: "418 bits", sub: "stem birthday 2⁹⁴·⁵" },
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
