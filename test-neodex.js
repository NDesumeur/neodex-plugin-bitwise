// lancé par le test « local » de NeoDex : tape un nombre et vérifie les autres bases, puis une opération, le texte en octets et un nombre à virgule
module.exports = async ({ pj, sleep }) => {
  const type = (id, v) => pj(`(() => { const f = document.getElementById(${JSON.stringify(id)}); f.value = ${JSON.stringify(v)}; f.dispatchEvent(new Event('input')); })(), 0`);
  const tab = k => pj(`document.querySelector('[data-tab=${k}]').click(), 0`);
  await sleep(400); await tab('num'); await sleep(200);
  await pj(`[...document.querySelectorAll('.bwRow .btn')].find(b => b.textContent === '32 bits').click(), 0`); await sleep(200);
  await type('bw_dec', '255'); await sleep(200);
  const hex = await pj(`document.getElementById('bw_hex').value`), ones = await pj(`document.querySelectorAll('.bwBit.on').length`);
  if (hex !== '0000 00FF' || ones !== 8) throw new Error('255 donne ' + hex + ' et ' + ones + ' bits allumés');
  await pj(`document.querySelector('.bwBit').click(), 0`); await sleep(200);  // le bit 31
  const d = await pj(`document.getElementById('bw_dec').value`);
  if (d !== '2147483903') throw new Error('clic sur le bit 31 : ' + d);
  await tab('ops'); await sleep(200); await type('bw_a', '12'); await type('bw_b', '10'); await pj(`document.querySelector('[data-op=and]').click(), 0`); await sleep(200);
  const r = await pj(`[...document.querySelectorAll('.bwTable tr')].pop().querySelector('.r1').textContent`);
  if (r !== '8') throw new Error('12 AND 10 = ' + r);
  await tab('text'); await sleep(200); await type('bw_text', 'Hé');
  const t = await pj(`document.getElementById('bw_textOut').textContent`);
  if (t !== '48 C3 A9') throw new Error('« Hé » en octets : ' + t);
  await tab('float'); await sleep(200); await type('bw_float', '-6.25'); await sleep(200);
  const f = await pj(`document.querySelector('.bwFormula').textContent`);
  if (!f.includes('0xC0C80000')) throw new Error('-6,25 en float : ' + f);
  await tab('ops'); await sleep(300); await pj(`document.querySelector('.bwTable').scrollIntoView({block: 'center'}), 0`); await sleep(300);
  return 'bases, bits cliquables, AND, UTF-8 et float ok';
};
