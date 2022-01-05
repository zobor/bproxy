import { ReplaySubject } from 'rxjs';

export const history$ = new ReplaySubject<string>(10);

export const onHistoryChange = (data: string) => {
  history$.next(data);
};
