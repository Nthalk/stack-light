import React, {createContext, useMemo, useState} from 'react';

export type Session = {
  email: string;
};
export type SessionManager = {
  login: (email: string, token: string) => void;
  logout: () => void;
};

export const SessionContext = createContext<Session>(null as Session);
export const SessionManagerContext = createContext<SessionManager>(
  null as SessionManager
);

export default function SessionProvider(props: {
  children: JSX.Element;
}): JSX.Element {
  const [session, _setSession] = useState<Session>(() => ({
    email: '',
  }));
  const sessionManager = useMemo<SessionManager>(
    () => ({
      login: (_email: string, _token: string) => {},
      logout: () => {},
    }),
    []
  );

  return (
    <SessionManagerContext.Provider value={sessionManager}>
      <SessionContext.Provider value={session}>
        {props.children}
      </SessionContext.Provider>
    </SessionManagerContext.Provider>
  );
}
