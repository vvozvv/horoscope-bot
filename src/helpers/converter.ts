import path from 'path';
import fs from 'fs';
import cheerio from 'cheerio';
import { convert } from 'convert-svg-to-webp';

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

  const webp = await convert($.html());

  if (webp) {
    await ctx.replyWithPhoto({ source: webp })
  }
};
