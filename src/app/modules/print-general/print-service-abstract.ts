import { BehaviorSubject, Observable } from 'rxjs'
import { InfoDevice } from '../print-html/print-usb.service'
export abstract class PrintAbstractService<T> {
    public abstract selectedDevice: BehaviorSubject<T>
    // public abstract isConnected: BehaviorSubject<boolean>
    public abstract infoDevice: BehaviorSubject<InfoDevice>
    public abstract process: BehaviorSubject<string>
    public abstract connect(): Observable<boolean>
    public abstract requestDevice<Y>(): Observable<Y>
    public abstract reconectar(): Observable<boolean>
    public abstract write(data: any): Promise<void>
    public abstract getInformation(): InfoDevice

    public abstract get isSupported(): boolean
}
