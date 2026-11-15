// st(name, enzyme, from, to, description, atp, nadh, fadh, co2, h+)  -- values are per glucose
const st = (n, e, a, b, d, atp = 0, nadh = 0, fadh = 0, co2 = 0, h = 0) => ({ n, e, a, b, d, v: { atp, nadh, fadh, co2, h } });

const stages = [
{ tab: "Glycolysis", icon: "🍬", loc: "Cytoplasm", ring: false,
  intro: "Glycolysis splits one 6-carbon glucose into two 3-carbon pyruvates in 10 steps. Steps 1–5 are the energy investment phase; steps 6–10 are the payoff phase. No oxygen is needed.",
  steps: [
  st("Phosphorylate glucose", "Hexokinase", "Glucose + ATP", "Glucose-6-phosphate + ADP", "Uses the first ATP. The added phosphate traps glucose inside the cell and keeps glucose entering.", -1),
  st("Isomerize", "Phosphoglucose isomerase", "Glucose-6-P", "Fructose-6-P", "Rearranges the ring sugar so the next phosphorylation can happen."),
  st("Second phosphorylation", "Phosphofructokinase-1 (PFK-1)", "Fructose-6-P + ATP", "Fructose-1,6-bisphosphate + ADP", "Uses the second ATP. This is the main control point of glycolysis: high ATP and citrate inhibit PFK-1, and AMP activates it.", -1),
  st("Cleave the sugar", "Aldolase", "Fructose-1,6-bisP", "DHAP + G3P", "The 6-carbon sugar splits into two 3-carbon phosphates: dihydroxyacetone phosphate and glyceraldehyde-3-phosphate."),
  st("Interconvert triose phosphates", "Triose phosphate isomerase", "DHAP", "G3P", "DHAP is converted to G3P, so every remaining step happens twice per glucose."),
  st("Oxidize and phosphorylate", "G3P dehydrogenase", "2 G3P + 2 NAD⁺ + 2 Pi", "2 (1,3-bisphosphoglycerate) + 2 NADH", "G3P is oxidized and NAD⁺ is reduced to NADH. In the cytosol this NADH reaches the mitochondrion by a shuttle (malate–aspartate or glycerol-phosphate), which affects the final ATP yield.", 0, 2),
  st("Substrate-level phosphorylation", "Phosphoglycerate kinase", "2 (1,3-BPG) + 2 ADP", "2 (3-phosphoglycerate) + 2 ATP", "A phosphate is transferred directly to ADP. This pays back the 2 ATP invested.", 2),
  st("Shift the phosphate", "Phosphoglycerate mutase", "3-Phosphoglycerate", "2-Phosphoglycerate", "Moves the phosphate from carbon 3 to carbon 2."),
  st("Dehydrate", "Enolase", "2-Phosphoglycerate", "Phosphoenolpyruvate (PEP) + H₂O", "Removing water creates PEP, a very high-energy phosphate compound."),
  st("Second payoff", "Pyruvate kinase", "2 PEP + 2 ADP", "2 Pyruvate + 2 ATP", "Another substrate-level phosphorylation. Net result: 2 ATP, 2 NADH and 2 pyruvate per glucose.", 2)
]},
{ tab: "Pyruvate Oxidation", icon: "🧬", loc: "Mitochondrial matrix", ring: false,
  intro: "The link reaction. Each pyruvate is moved into the mitochondrion and converted to acetyl-CoA by the pyruvate dehydrogenase complex (PDC). It happens twice per glucose.",
  steps: [
  st("Transport in", "Mitochondrial pyruvate carrier", "Pyruvate (cytosol)", "Pyruvate (matrix)", "Pyruvate crosses the outer membrane through porins and the inner membrane through a carrier protein."),
  st("Decarboxylate", "PDC, E1 (with TPP)", "Pyruvate", "Hydroxyethyl-TPP + CO₂", "The first carbon leaves as CO₂, the first of 6 CO₂ released from glucose.", 0, 0, 0, 2),
  st("Oxidize and transfer", "PDC, E2 (lipoamide)", "Hydroxyethyl-TPP", "Acetyl-lipoamide", "The 2-carbon fragment is oxidized to an acetyl group and carried on a flexible lipoamide arm."),
  st("Attach CoA and regenerate", "PDC, E2 then E3 (FAD)", "Acetyl-lipoamide + CoA + NAD⁺", "Acetyl-CoA + NADH", "Acetyl-CoA is released. E3 reoxidizes the lipoamide, passing electrons through FAD to NAD⁺. The complex is inhibited by its products, NADH and acetyl-CoA.", 0, 2)
]},
{ tab: "Krebs Cycle", icon: "🔄", loc: "Mitochondrial matrix", ring: true,
  intro: "Also called the citric acid cycle. Acetyl-CoA joins oxaloacetate (OAA), and 8 reactions regenerate OAA. The cycle turns twice per glucose, so the totals below are per glucose (both turns): 6 NADH, 2 FADH₂, 2 ATP and 4 CO₂.",
  steps: [
  st("Condense", "Citrate synthase", "Acetyl-CoA (2C) + Oxaloacetate (4C)", "Citrate (6C) + CoA", "The acetyl group joins OAA. Hydrolysis of the thioester bond drives the reaction forward."),
  st("Isomerize", "Aconitase", "Citrate", "Isocitrate", "Citrate is rearranged (through cis-aconitate) so that the next step can oxidize it."),
  st("Oxidative decarboxylation 1", "Isocitrate dehydrogenase", "Isocitrate + NAD⁺", "α-Ketoglutarate (5C) + NADH + CO₂", "First CO₂ lost and first NADH made. This is a key regulated step, activated by ADP and inhibited by ATP and NADH.", 0, 2, 0, 2),
  st("Oxidative decarboxylation 2", "α-Ketoglutarate dehydrogenase complex", "α-Ketoglutarate + NAD⁺ + CoA", "Succinyl-CoA (4C) + NADH + CO₂", "Second CO₂ lost and second NADH. This complex resembles the PDC. Both carbons from the original acetyl group are still in the cycle.", 0, 2, 0, 2),
  st("Substrate-level phosphorylation", "Succinyl-CoA synthetase", "Succinyl-CoA + GDP + Pi", "Succinate + GTP (≈ ATP) + CoA", "GTP is made (ATP in some tissues). This is the only direct ATP/GTP gain in the cycle.", 2),
  st("Oxidize succinate", "Succinate dehydrogenase (Complex II)", "Succinate + FAD", "Fumarate + FADH₂", "FAD is used because the energy released is too small to reduce NAD⁺. This enzyme sits in the inner membrane and is also Complex II of the ETC.", 0, 0, 2),
  st("Hydrate", "Fumarase", "Fumarate + H₂O", "Malate", "Water is added across the double bond."),
  st("Oxidize malate", "Malate dehydrogenase", "Malate + NAD⁺", "Oxaloacetate + NADH", "OAA is regenerated, so the cycle can accept the next acetyl-CoA. Third NADH of the turn.", 0, 2)
]},
{ tab: "Electron Transport", icon: "⚡", loc: "Inner mitochondrial membrane", ring: false,
  intro: "NADH and FADH₂ give up their electrons to protein complexes in the inner membrane. As electrons move to lower energy, Complexes I, III and IV pump H⁺ from the matrix into the intermembrane space. Counts below are for all 10 NADH and 2 FADH₂ from one glucose.",
  steps: [
  st("Complex I", "NADH dehydrogenase", "10 NADH + Q", "10 NAD⁺ + QH₂", "NADH drops electrons off at Complex I, which pumps 4 H⁺ per NADH (40 H⁺ total). NAD⁺ returns to the earlier stages.", 0, -10, 0, 0, 40),
  st("Complex II", "Succinate dehydrogenase", "2 FADH₂ + Q", "2 FAD + QH₂", "FADH₂ enters at Complex II, which pumps no protons. This is why FADH₂ yields less ATP than NADH.", 0, 0, -2),
  st("Complex III", "Cytochrome bc₁ (Q cycle)", "QH₂ + 2 cyt c (Fe³⁺)", "Q + 2 cyt c (Fe²⁺)", "Ubiquinone (Q) shuttles electrons to Complex III. The Q cycle pumps 4 H⁺ per electron pair (48 H⁺ total). Cytochrome c carries electrons one at a time to Complex IV.", 0, 0, 0, 0, 48),
  st("Complex IV", "Cytochrome c oxidase", "cyt c + ½ O₂ + 2 H⁺", "cyt c (oxidized) + H₂O", "Oxygen is the final electron acceptor, forming 6 H₂O per glucose. 2 H⁺ pumped per pair (24 H⁺ total). Without O₂ the chain backs up and stops.", 0, 0, 0, 0, 24)
]},
{ tab: "Chemiosmosis", icon: "⚙️", loc: "Inner membrane (ATP synthase)", ring: false,
  intro: "Pumping builds a proton gradient: the intermembrane space is more acidic (chemical gradient) and more positive (electrical gradient). Together these form the proton-motive force that drives ATP synthase.",
  steps: [
  st("Proton-motive force", "ETC complexes I, III, IV", "H⁺ (matrix)", "H⁺ (intermembrane space)", "Because the inner membrane is impermeable to H⁺, the gradient stores energy like water behind a dam. About 112 H⁺ have been pumped for this glucose."),
  st("Protons flow down the gradient", "ATP synthase, F₀ unit", "112 H⁺ (intermembrane space)", "112 H⁺ (matrix)", "H⁺ flows through the F₀ channel, spinning the c-ring and the central stalk like a turbine.", 0, 0, 0, 0, -112),
  st("Rotation makes ATP", "ATP synthase, F₁ unit (binding change)", "ADP + Pi", "ATP", "The spinning stalk changes the shape of the F₁ head, which binds ADP and Pi, forms ATP, and releases it. About 4 H⁺ per ATP (3 for the rotor plus 1 to bring in Pi) gives 28 ATP.", 28),
  st("Inhibitors and uncouplers", "Cyanide, oligomycin, DNP", "—", "—", "Cyanide blocks Complex IV, oligomycin blocks the ATP synthase F₀ channel, and uncouplers (DNP; UCP1 in brown fat) let H⁺ leak back so energy is lost as heat instead of ATP.")
]}
];

let S = 0, I = 0, timer = null;
const $ = (id) => document.getElementById(id);

function totals() {
  const t = { atp: 0, nadh: 0, fadh: 0, co2: 0, h: 0 };
  stages.forEach((s, si) => s.steps.forEach((p, pi) => {
    if (si < S || (si === S && pi <= I)) for (const k in t) t[k] += p.v[k];
  }));
  return t;
}

function atEnd() { return S === stages.length - 1 && I === stages[S].steps.length - 1; }

function render() {
  const s = stages[S], p = s.steps[I], t = totals();

  $("tabs").innerHTML = "";
  stages.forEach((x, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = (i + 1) + ". " + x.tab;
    b.className = i === S ? "active" : "";
    b.onclick = () => { S = i; I = 0; render(); };
    $("tabs").appendChild(b);
  });

  $("intro").textContent = s.intro;
  const d = $("diagram");
  d.className = "diagram" + (s.ring ? " ring" : "");
  d.innerHTML = s.ring ? '<div class="hub">Krebs<br>cycle<br><small>2 turns per glucose</small></div>' : "";
  s.steps.forEach((x, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "node" + (i === I ? " on" : i < I ? " done" : "");
    b.innerHTML = "<b>" + (i + 1) + "</b> " + x.n;
    if (s.ring) {
      const a = (i / s.steps.length) * 2 * Math.PI - Math.PI / 2;
      b.style.left = 50 + 40 * Math.cos(a) + "%";
      b.style.top = 50 + 40 * Math.sin(a) + "%";
    }
    b.onclick = () => { I = i; render(); };
    d.appendChild(b);
  });

  const ic = $("icon");
  ic.textContent = s.icon;
  ic.className = "icon" + (S === 4 && I >= 1 && I <= 2 ? " spin" : "");
  $("where").textContent = "Location: " + s.loc + " · Step " + (I + 1) + " of " + s.steps.length;
  $("stepName").textContent = p.n;
  $("reaction").textContent = p.a + "  →  " + p.b;
  $("enzyme").textContent = "Enzyme / complex: " + p.e;
  $("desc").textContent = p.d;

  const names = { atp: "ATP", nadh: "NADH", fadh: "FADH₂", co2: "CO₂", h: "H⁺" };
  const chips = Object.keys(names).filter((k) => p.v[k]).map((k) => {
    const v = p.v[k];
    return '<span class="chip ' + (v > 0 ? "up" : "down") + '">' + (v > 0 ? "+" : "") + v + " " + names[k] + "</span>";
  });
  $("deltas").innerHTML = chips.length ? chips.join("") : '<span class="chip">No change to the tracker</span>';

  $("atp").textContent = t.atp; $("nadh").textContent = t.nadh;
  $("fadh").textContent = t.fadh; $("co2").textContent = t.co2;
  $("hnum").textContent = t.h;
  $("hbar").style.width = Math.min(100, (t.h / 112) * 100) + "%";
  $("final").textContent = atEnd()
    ? "Total: " + t.atp + " ATP per glucose (2 glycolysis + 2 Krebs + 28 chemiosmosis). Real cells make about 30–32 because of shuttle costs and proton leak."
    : "";

  $("prev").disabled = S === 0 && I === 0;
  $("next").disabled = atEnd();
  if (atEnd()) stop();
}

function next() {
  if (I < stages[S].steps.length - 1) I++;
  else if (S < stages.length - 1) { S++; I = 0; }
  render();
}
function prev() {
  if (I > 0) I--;
  else if (S > 0) { S--; I = stages[S].steps.length - 1; }
  render();
}
function stop() { clearInterval(timer); timer = null; $("play").textContent = "▶ Auto-play"; }
function play() {
  if (timer) return stop();
  if (atEnd()) { S = 0; I = 0; render(); }
  $("play").textContent = "⏸ Pause";
  timer = setInterval(next, 3500);
}

$("next").onclick = next;
$("prev").onclick = prev;
$("play").onclick = play;
$("reset").onclick = () => { stop(); S = 0; I = 0; render(); };
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});
render();
