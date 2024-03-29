/**
 * kiểm tra xem chuỗi có là Guid và Guid có rỗng và lưu Guid empty
 * HAN - 08.03.2023
 */
export class Guid {

    public empty = '00000000-0000-0000-0000-000000000000';

    public newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:no-bitwise
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public isGuid(guidId: string) {
        const regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi; //eslint-disable-line
        return regexGuid.test(guidId);
    }

}
