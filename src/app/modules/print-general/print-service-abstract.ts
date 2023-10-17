import { BehaviorSubject, Observable } from 'rxjs'
import { InfoDevice } from '../print-html/print-usb.service'
export abstract class PrintAbstractService<T> {
    public abstract selectedDevice: BehaviorSubject<T>
    public abstract isConnected: BehaviorSubject<boolean>
    public abstract info: BehaviorSubject<string>
    public abstract connect(): void
    public abstract requestDevice(): Observable<T>
    public abstract reconnect(): Observable<T>
    public abstract write(data: any): Promise<void>
    public abstract getInformation(): InfoDevice
    public abstract disconnect(): void

    public abstract get isSupported(): boolean
}
