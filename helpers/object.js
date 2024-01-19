/**
 * @param {Array<number | string>} flexSeats
 * @param {Array<any>} bookingSeats
 */
exports.convertToSeats = function (flexSeats, bookingSeats, permanentSeats) {
  return {
    flex: flexSeats.reduce((acc, item) => {
      acc[parseInt(item)] = '';
      return acc;
    }, {}),
    booking: bookingSeats.reduce((acc, item) => {
      const fio = item?.userId?.fio?.split(' ');
      acc[parseInt(item.reservedSeat.number)] =
        `${fio[0]} ${fio[1][0]}.${fio[2][0]}\n`;
      return acc;
    }, {}),
    permanent: permanentSeats.reduce((acc, item) => {
      const fio = item?.userId?.fio?.split(' ');
      acc[parseInt(item.number)] = `${fio[0]} ${fio[1][0]}.${fio[2][0]}\n`;
      return acc;
    }, {}),
  };
};
