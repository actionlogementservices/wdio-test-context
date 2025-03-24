import { TestContext } from './test-context';

export { TestContext };

/** TestContextWorkerService options */
export type TestContextWorkerServiceOptions = {
  testContext: TestContext;
  logLevel?: LogLevel;
};

/** User gender. */
export type Gender = 'Madame' | 'Monsieur';

/** Implemented disposable email provider */
export type MailProviderName = 'yopmail' | 'maildrop' | 'guerrillamail';

/** Disposable email provider */
export type MailProvider = {
  /** name of the provider */ name: string;
  /** domains exposed of the provider */ domains: string[];
  /** wdio logic to open the inbox */ openInbox: (email?: string) => Promise<void>;
  /** wdio logic to get emails */ getMessages: () => Promise<{ from: string; subject: string }[]>;
  /** wdio logic to retieve email content */ getMessageContent: (index: number) => Promise<string>;
};

/** Randomly auto generated user */
export type TestUser = {
  /** last name */ lastname: string;
  /** first name */ firstname: string;
  /** gender */ gender: Gender;
  /** e-mail */ email: string;
  /** password */ password: string;
};

/** Recorded generated user */
export type RecordedTestUser = TestUser & {
  /** target environment used for recording */ environment: string;
  /** dataset used for recording */ dataset: string;
  /** recording date */ date: string;
};

/** Log level */
export type LogLevel = 'none' | 'error' | 'warn' | 'info' | 'debug';

/** Test environment configuration*/
export type TestEnvironmentConfiguration = {
  /** parameters of the environment */ parameters: Map<string, any>;
  /** options of the environment */ options: EnvironmentOptions;
};

/** Custom options for the environement */
export type EnvironmentOptions = {
  /** Retrieve dataset **per environment** rather than globally. Dataset are global if not specified. */
  perEnvironmentData?: boolean;
};

/** Generate dynamic data to append to TestContext */
export type DataGenerator = {
  (context: TestContext): any;
};
