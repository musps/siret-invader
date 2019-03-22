/**
const currentIndex = process.env.CURRENT_INDEX;
process.env['CURRENT_INDEX'] = process.env.CURRENT_INDEX + 1;

console.log('currentIndex', currentIndex, Date.now());
*/

console.log('process start')

const onProcessStart = (data) => {
  console.log('onProcessStart')

  process.send({
    type: 'onProcessStart',
    data: {
      success : true
    }
  })
}

process.on('message', ({ type, data, topic }) => {
  switch (type) {
    case 'onProcessStart':
      onProcessStart(data)
      break;
    default:
      break;
  };
});
