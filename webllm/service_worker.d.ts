import { AppConfig, ChatOptions, MLCEngineConfig } from "../src/config";
import { WorkerRequest } from "../src/message";
import { MLCEngineInterface } from "../src/types";
import { MLCEngineWorkerHandler, WebWorkerMLCEngine, ChatWorker } from "../src/web_worker";
type IServiceWorker = globalThis.ServiceWorker;
/**
 * Worker handler that can be used in a ServiceWorker.
 *
 * @example
 *
 * const engine = new MLCEngine();
 * let handler;
 * chrome.runtime.onConnect.addListener(function (port) {
 *   if (handler === undefined) {
 *     handler = new ServiceWorkerMLCEngineHandler(engine, port);
 *   } else {
 *     handler.setPort(port);
 *   }
 *   port.onMessage.addListener(handler.onmessage.bind(handler));
 * });
 */
export declare class ServiceWorkerMLCEngineHandler extends MLCEngineWorkerHandler {
    modelId?: string;
    chatOpts?: ChatOptions;
    appConfig?: AppConfig;
    private clientRegistry;
    private initReuqestUuid?;
    constructor(engine: MLCEngineInterface);
    onmessage(event: ExtendableMessageEvent, onComplete?: (value: any) => void, onError?: () => void): void;
}
/**
 * PostMessageHandler wrapper for sending message from client to service worker
 */
export declare class ServiceWorker implements ChatWorker {
    serviceWorker: IServiceWorker;
    onmessage: () => void;
    constructor(serviceWorker: IServiceWorker);
    postMessage(message: WorkerRequest): void;
}
/**
 * Create a ServiceWorkerMLCEngine.
 *
 * @param modelId The model to load, needs to either be in `webllm.prebuiltAppConfig`, or in
 * `engineConfig.appConfig`.
 * @param engineConfig Optionally configures the engine, see `webllm.MLCEngineConfig` for more.
 * @returns An initialized `WebLLM.ServiceWorkerMLCEngine` with `modelId` loaded.
 */
export declare function CreateServiceWorkerMLCEngine(modelId: string, engineConfig?: MLCEngineConfig): Promise<ServiceWorkerMLCEngine>;
/**
 * A client of MLCEngine that exposes the same interface
 */
export declare class ServiceWorkerMLCEngine extends WebWorkerMLCEngine {
    missedHeatbeat: number;
    constructor(worker: IServiceWorker, keepAliveMs?: number);
    /**
     * Initialize the chat with a model.
     *
     * @param modelId model_id of the model to load.
     * @param chatOpts Extra options to overide chat behavior.
     * @param appConfig Override the app config in this load.
     * @returns A promise when reload finishes.
     * @note The difference between init and reload is that init
     * should be called only once when the engine is created, while reload
     * can be called multiple times to switch between models.
     */
    init(modelId: string, chatOpts?: ChatOptions, appConfig?: AppConfig): Promise<void>;
}
export {};
//# sourceMappingURL=service_worker.d.ts.map