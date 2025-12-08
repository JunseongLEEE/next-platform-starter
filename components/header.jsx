import Image from 'next/image';
import Link from 'next/link';
import netlifyLogo from 'public/netlify-logo.svg';
import githubLogo from 'public/images/github-mark-white.svg';

const navItems = [
    { linkText: '홈', href: '/' },
    { linkText: '기능', href: '/#features' },
    { linkText: '사전 신청', href: '/#signup' },
    { linkText: 'A‑EYE', href: '/aeye?src=https%3A%2F%2Fnonsparing-balustered-juanita.ngrok-free.dev' }
];

export function Header() {
    return (
        <nav className="flex flex-wrap items-center gap-4 pt-6 pb-12 sm:pt-12 md:pb-24">
            <Link href="/">
                <Image src={netlifyLogo} alt="Netlify logo" />
            </Link>
            {!!navItems?.length && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} className="inline-flex px-1.5 py-1 sm:px-3 sm:py-2">
                                {item.linkText}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <Link href="/#signup" className="ml-auto btn">
                사전 신청
            </Link>
        </nav>
    );
}
