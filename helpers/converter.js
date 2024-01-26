const path = require('path');
const svg2img = require('svg2img');
const fs = require('fs');
const cheerio = require('cheerio');

const colorScheme = {
  free: '#7E52A0',
  booking: '#E86630',
  permanent: '#55BB99',
};

/**
 * Конвертирование svg схемы мест в png с отображением мест.
 */
exports.converterSvgToPng = async function (date, seat, ctx) {
  const fileName = path.resolve(
    `assets/seats-archive/${new Date(date).toISOString().split('T')[0]}.png`,
  );

  const svgContent = fs.readFileSync(
    path.join('assets/big-data-seat-v3.svg'),
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

  await svg2img(
    path.resolve(__dirname, 'BigData-1.svg'),
    async function (error, buffer) {
      await fs.writeFileSync(fileName, buffer);
      await ctx.replyWithPhoto({ source: fileName });
    },
  );
};
