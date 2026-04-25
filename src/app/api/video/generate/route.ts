import { NextRequest, NextResponse } from 'next/server';
import { VideoGenerationClient, Config, HeaderUtils, Content } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { prompt, duration, ratio, resolution, generateAudio } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的视频描述' },
        { status: 400 }
      );
    }

    // Extract forward headers for request tracing
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    // Initialize SDK client
    const config = new Config();
    const client = new VideoGenerationClient(config, customHeaders);

    // Prepare content
    const content: Content[] = [
      {
        type: 'text' as const,
        text: prompt,
      },
    ];

    // Generate video
    const response = await client.videoGeneration(content, {
      model: 'doubao-seedance-1-5-pro-251215',
      duration: parseInt(duration) || 5,
      ratio: ratio || '16:9',
      resolution: resolution || '720p',
      watermark: true,
      generateAudio: generateAudio !== false,
    });

    if (response.videoUrl) {
      return NextResponse.json({
        success: true,
        videoUrl: response.videoUrl,
        lastFrameUrl: response.lastFrameUrl,
        taskId: response.response.id,
        status: response.response.status,
      });
    } else {
      return NextResponse.json(
        { error: response.response.error_message || '视频生成失败' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Video generation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: '视频生成服务异常' },
      { status: 500 }
    );
  }
}
