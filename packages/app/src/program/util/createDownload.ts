export function downloadFile(fileName: string, content: string): void {
  const aLink = document.createElement('a');
  const blob = new Blob([content]);
  const event = document.createEvent('HTMLEvents');
  event.initEvent('click', false, false);
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  aLink.dispatchEvent(event);
}

export function macOSDownloadFile(fileName: string, content: string): void {
  const aLink = document.createElement('a');
  const event = document.createEvent('MouseEvents');
  event.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
  );
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(new Blob([content], {type: 'text/csv'}));
  aLink.dispatchEvent(event);
}
