import * as API from "../src/openai_api_protocols/apis";
import { ChatOptions, AppConfig, GenerationConfig, MLCEngineConfig } from "../src/config";
import { ChatCompletionRequest, ChatCompletion, ChatCompletionChunk, ChatCompletionFinishReason, ChatCompletionRequestNonStreaming, ChatCompletionRequestStreaming, ChatCompletionRequestBase } from "../src/openai_api_protocols/index";
import { InitProgressCallback, MLCEngineInterface, GenerateProgressCallback, LogitProcessor } from "../src/types";
/**
 * Creates `MLCEngine`, and loads `modelId` onto WebGPU.
 *
 * Equivalent to `new webllm.MLCEngine().reload(...)`.
 *
 * @param modelId The model to load, needs to either be in `webllm.prebuiltAppConfig`, or in
 * `engineConfig.appConfig`.
 * @param engineConfig Optionally configures the engine, see `webllm.MLCEngineConfig`.
 * @returns An initialized `WebLLM.MLCEngine` with `modelId` loaded.
 * @throws Throws error when device lost (mostly due to OOM); users should re-call `CreateMLCEngine()`,
 *   potentially with a smaller model or smaller context window size.
 */
export declare function CreateMLCEngine(modelId: string, engineConfig?: MLCEngineConfig): Promise<MLCEngine>;
/**
 * The main interface of MLCEngine, which loads a model and performs tasks.
 *
 * You can either initialize one with `webllm.CreateMLCEngine(modelId)`, or `webllm.MLCEngine().reload(modelId)`.
 */
export declare class MLCEngine implements MLCEngineInterface {
    chat: API.Chat;
    private currentModelId?;
    private logger;
    private logitProcessorRegistry?;
    private logitProcessor?;
    private pipeline?;
    private initProgressCallback?;
    private interruptSignal;
    private deviceLostIsError;
    private config?;
    constructor();
    setInitProgressCallback(initProgressCallback?: InitProgressCallback): void;
    getInitProgressCallback(): InitProgressCallback | undefined;
    setLogitProcessorRegistry(logitProcessorRegistry?: Map<string, LogitProcessor>): void;
    /**
     * Reload model `modelId`.
     * @param modelId The model to load, needs to either be in `webllm.prebuiltAppConfig`, or in
     * `engineConfig.appConfig`.
     * @param chatOpts To optionally override the `mlc-chat-config.json` of `modelId`.
     * @param appConfig Configure the app with the list of models and whether to use IndexedDB cache.
     * @throws Throws error when device lost (mostly due to OOM); users should re-call reload(),
     *   potentially with a smaller model or smaller context window size.
     */
    reload(modelId: string, chatOpts?: ChatOptions, appConfig?: AppConfig): Promise<void>;
    generate(input: string | ChatCompletionRequestNonStreaming, progressCallback?: GenerateProgressCallback, streamInterval?: number, genConfig?: GenerationConfig): Promise<string>;
    private _generate;
    /**
     * Similar to `generate()`; but instead of using callback, we use an async iterable.
     * @param request Request for chat completion.
     * @param genConfig Generation config extraced from `request`.
     */
    chatCompletionAsyncChunkGenerator(request: ChatCompletionRequestStreaming, genConfig: GenerationConfig): AsyncGenerator<ChatCompletionChunk, void, void>;
    /**
     * Completes a single ChatCompletionRequest.
     *
     * @param request A OpenAI-style ChatCompletion request.
     *
     * @note For each choice (i.e. `n`), a request is defined by a single `prefill()` and mulitple
     * `decode()`. This is important as it determines the behavior of various fields including `seed`.
     */
    chatCompletion(request: ChatCompletionRequestNonStreaming): Promise<ChatCompletion>;
    chatCompletion(request: ChatCompletionRequestStreaming): Promise<AsyncIterable<ChatCompletionChunk>>;
    chatCompletion(request: ChatCompletionRequestBase): Promise<AsyncIterable<ChatCompletionChunk> | ChatCompletion>;
    interruptGenerate(): Promise<void>;
    runtimeStatsText(): Promise<string>;
    resetChat(keepStats?: boolean): Promise<void>;
    unload(): Promise<void>;
    getMaxStorageBufferBindingSize(): Promise<number>;
    getGPUVendor(): Promise<string>;
    forwardTokensAndSample(inputIds: Array<number>, isPrefill: boolean): Promise<number>;
    /**
     * @returns Whether the generation stopped.
     */
    stopped(): boolean;
    /**
     * @returns Finish reason; undefined if generation not started/stopped yet.
     */
    getFinishReason(): ChatCompletionFinishReason | undefined;
    /**
     * Get the current generated response.
     *
     * @returns The current output message.
     */
    getMessage(): Promise<string>;
    /**
     * Get a new Conversation object based on the chat completion request.
     *
     * @param request The incoming ChatCompletionRequest
     * @note `request.messages[-1]` is not included as it would be treated as a normal input to
     * `prefill()`.
     */
    private getConversationFromChatCompletionRequest;
    /**
     * Returns the function string based on the request.tools and request.tool_choice, raises erros if
     * encounter invalid request.
     *
     * @param request The chatCompletionRequest we are about to prefill for.
     * @returns The string used to set Conversatoin.function_string
     */
    private getFunctionCallUsage;
    /**
     * Run a prefill step with a given input.
     *
     * If `input` is a chatCompletionRequest, we treat `input.messages[-1]` as the usual user input.
     * We then convert `input.messages[:-1]` to a `Conversation` object, representing a conversation
     * history.
     *
     * If the new `Conversation` object matches the current one loaded, it means we are
     * performing multi-round chatting, so we do not reset, hence reusing KV cache. Otherwise, we
     * reset every thing, treating the request as something completely new.
     *
     * @param input The input prompt, or `messages` in OpenAI-like APIs.
     */
    prefill(input: string | ChatCompletionRequest, genConfig?: GenerationConfig): Promise<void>;
    /**
     * Run a decode step to decode the next token.
     */
    decode(genConfig?: GenerationConfig): Promise<void>;
    private getPipeline;
    private asyncLoadTokenizer;
}
//# sourceMappingURL=engine.d.ts.map