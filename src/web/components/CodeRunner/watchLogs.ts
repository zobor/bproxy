import { ReplaySubject } from 'rxjs';

export const logs$ = new ReplaySubject(1);

export const onLogRecive = (data: any) => {
  logs$.next(data);
};
