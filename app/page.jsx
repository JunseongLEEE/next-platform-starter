import Link from 'next/link';
import Image from 'next/image';
import { Card } from 'components/card';
import { FeedbackForm } from 'components/feedback-form';

export default function Page() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section>
                <h1 className="mb-4">A-EYE – 시각 보조 서비스</h1>
                <p className="mb-6 text-lg">
                    A-EYE는 주변 환경을 인식하고 안전한 이동을 돕는 차세대 시각 보조 서비스입니다.
                    현재는 프리뷰 단계로, 정식 출시 소식을 가장 먼저 받아보세요.
                </p>
                <Link href="/#signup" className="btn btn-lg sm:min-w-64">사전 신청</Link>
            </section>

            <section id="features" className="grid gap-4 sm:grid-cols-2">
                <Card title="주변 상황 인식">
                    <p>실시간으로 주변 사물을 파악하고 위험 요소를 알려줍니다.</p>
                </Card>
                <Card title="안전한 길안내">
                    <p>보행에 최적화된 흐름으로 목적지까지 안내합니다.</p>
                </Card>
                <Card title="간편한 사용성" className="sm:col-span-2">
                    <p>큰 버튼과 음성 피드백으로 누구나 쉽게 사용할 수 있습니다.</p>
                </Card>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
                <Card title="예상 데모 화면" className="sm:col-span-2">
                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm">
                        <Image
                            src="/images/aeye-demo.png"
                            alt="A-EYE 예상 데모 화면"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                </Card>
            </section>

            <section id="signup" className="scroll-mt-24">
                <FeedbackForm />
            </section>
        </div>
    );
}
