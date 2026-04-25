import { NextRequest, NextResponse } from 'next/server';
import { TTSClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { template, script, audioUrl } = await request.json();

    if (!script && !audioUrl) {
      return NextResponse.json(
        { error: '请提供文案脚本或音频文件' },
        { status: 400 }
      );
    }

    // Extract forward headers for request tracing
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    // Initialize SDK client
    const config = new Config();

    // If script is provided, generate TTS first
    let finalAudioUrl = audioUrl;
    
    if (script && !audioUrl) {
      const ttsClient = new TTSClient(config, customHeaders);
      const ttsResponse = await ttsClient.synthesize({
        uid: `digital-human-${Date.now()}`,
        text: script,
        speaker: 'zh_female_xiaohe_uranus_bigtts',
      });
      finalAudioUrl = ttsResponse.audioUri;
    }

    // Note: Digital human video generation would require a workflow or specialized API
    // For now, we return the audio URL and a placeholder message
    // In production, you would integrate with a digital human API here

    return NextResponse.json({
      success: true,
      audioUrl: finalAudioUrl,
      message: '数字人视频生成功能正在准备中，音频已生成',
      // In production, this would be the digital human video URL
      videoUrl: null,
      status: 'audio_ready',
    });
  } catch (error) {
    console.error('Digital human generation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: '数字人生成服务异常' },
      { status: 500 }
    );
  }
}
