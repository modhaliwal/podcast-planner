
declare module 'auth/module' {
  import { FederatedAuth } from '../integrations/auth/types';
  const module: FederatedAuth;
  export default module;
}
