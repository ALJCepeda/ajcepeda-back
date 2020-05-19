type ReqT<IAPI extends IEndpoint<IAPI['IRequest'], IAPI['IResponse']>> = IAPI['IRequest'];
type RespT<IAPI extends IEndpoint<IAPI['IRequest'], IAPI['IResponse']>> = IAPI['IResponse'];

interface ActionPayload<T> {
  type:string;
  payload:T;
}

interface TimelineModuleState {

}

interface AppState {
  authenticated:boolean;
}

type Callback<T, R = void> = (err:Error | null, resp?:T) => R;

interface SFormControls<IResourceType> {
  key:keyof IResourceType;
  label:string;
  type:'text' | 'textarea' | 'date' | 'time' | 'datetime' | 'editor';
  readonly?:boolean;
  hideIfEmpty?:boolean;
}

interface SFormOptions<IResourceType extends object> {
  editing?: boolean;
  editable?: boolean;
  actions?: { [type: string]: (payload: IResourceType) => Promise<any> };
  state?: IRevertObject<IResourceType>;
  controls?: SFormControls<IResourceType>[];
}

interface IRevertObject<T extends object> {
  committed: T;
  data: T;
  isDirty(): boolean;
  reset();
  commit(data?:T);
}