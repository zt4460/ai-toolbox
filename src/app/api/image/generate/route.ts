import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { prompt, size } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的图片描述' },
        { status: 400 }
      );
    }

    // Extract forward headers for request tracing
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    // Initialize SDK client
    const config = new Config();
    const client = new ImageGenerationClient(config, customHeaders);

    // Generate image
    const response = await client.generate({
      prompt,
      size: size || '2K',
      watermark: true,
    });

    const helper = client.getResponseHelper(response);

    if (helper.success) {
      return NextResponse.json({
        success: true,
        imageUrls: helper.imageUrls,
      });
    } else {
      return NextResponse.json(
        { error: helper.errorMessages.join(', ') || '图片生成失败' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Image generation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: '图片生成服务异常' },
      { status: 500 }
    );
  }
}
