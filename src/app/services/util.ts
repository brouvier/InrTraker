import { DatePipe } from "@angular/common";

export function formatDateTime(dt: Date): string {
    const r = (new DatePipe('en-US')).transform(dt, 'yyyy-MM-dd HH:mm');
    return (r ?? '');
}

export function formatDate(dt: Date): string {
    const r = (new DatePipe('en-US')).transform(dt, 'yyyy-MM-dd');
    return (r ?? '');
}

export function addHours(dt: string, h: number): string {
    const d = new Date(dt);
    d.setTime(d.getTime() + (h*60*60*1000));
    return formatDateTime(d);
}

export function dateMatch(dt: string) {
  return dt.match('20[0-9]{2}-[0-1][0-9]-[0-3][0-9]')
}

export function dateTimeMatch(dt: string) {
    return dt.match('20[0-9]{2}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-6][0-9]:[0-6][0-9]')
}