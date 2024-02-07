import path from 'path';
import svg2img from 'svg2png';
import fs from 'fs';
import cheerio from 'cheerio';

const colorScheme = {
  free: '#7E52A0',
  booking: '#E86630',
  permanent: '#55BB99',
};

/**
 * Конвертирование svg схемы мест в png с отображением мест.
 */
export const converterSvgToPng = async function (date, seat: Record<string, any>, ctx) {
  const fileName = path.resolve(
    `src/assets/seats-archive/${new Date(date).toISOString().split('T')[0]}.png`,
  );

  const svgContent = fs.readFileSync(
    path.join(__dirname, 'big-data-seat-v3.svg'),
    'utf-8',
  );

  const $ = cheerio.load(svgContent);

  Object.entries(seat).forEach(([keyLabel, i]) => {
    Object.entries(i).forEach(([key, _]) => {
      $(`#${key}`).attr('fill', colorScheme[keyLabel]);
    });
  });

  if (fs.existsSync(path.join(__dirname, 'BigData-1.svg'))) {
    fs.unlinkSync(path.join(__dirname, 'BigData-1.svg'));
  }

  await fs.promises.writeFile(path.join(__dirname, 'BigData-1.svg'), $.html());
  const file = await fs.readFileSync(path.join(__dirname, 'BigData-1.svg'));

  const f = await svg2img(file);

  console.log('file', f)

  if (f) {
    await fs.writeFileSync(fileName, f);
    await ctx.replyWithPhoto({ source: fileName })
  }
};