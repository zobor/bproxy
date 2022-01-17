import { formatSeconds, parseFormData } from '../src/proxy/utils/format';

const formString = `
--------------------------fd479547a612c968
Content-Disposition: form-data; name="userid"

1
--------------------------fd479547a612c968
Content-Disposition: form-data; name="filecomment"

This is an image file
--------------------------fd479547a612c968
Content-Disposition: form-data; name="image"; filename="1.jpg"
Content-Type: image/jpeg

111111
`

describe('format.ts', () => {
  it('formatSeconds', () => {
    expect(formatSeconds(500)).toEqual('500ms');
    expect(formatSeconds(1340)).toEqual('1.3s');
    expect(formatSeconds(1350)).toEqual('1.4s');
  });
  it.only('parseFormData', () => {
    const rs: any = parseFormData(formString);
    expect(rs.userid === '1').toBeTruthy();
    expect(rs.filecomment === 'This is an image file').toBeTruthy();
    expect(rs.image === '二进制文件').toBeTruthy();
  });
});

