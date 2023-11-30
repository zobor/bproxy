import { useState } from 'react';
import { BehaviorSubject } from 'rxjs';

const sub$ = new BehaviorSubject(0);

export function UseSubject() {
  const [subject] = useState<any>(sub$);

  return subject;
}
