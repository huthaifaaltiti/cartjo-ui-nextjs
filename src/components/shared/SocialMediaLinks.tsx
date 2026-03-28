import Link from "next/link";
import {
  FaWhatsapp,
  FaXTwitter,
  FaFacebook,
  FaInstagram,
  FaSnapchat,
  FaTiktok,
  FaLinkedinIn,
} from "react-icons/fa6";

const socialLinks = [
  {
    key: "whatsapp",
    href: process.env.NEXT_PUBLIC_SOCIAL_MEDIA_WHATSAPP_LINK,
    icon: FaWhatsapp,
  },
  {
    key: "x",
    href: process.env.NEXT_PUBLIC_SOCIAL_MEDIA_X_LINK,
    icon: FaXTwitter,
  },
  {
    key: "facebook",
    href: process.env.NEXT_PUBLIC_SOCIAL_MEDIA_FACEBOOK_LINK,
    icon: FaFacebook,
  },
  {
    key: "instagram",
    href: process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INSTAGRAM_LINK,
    icon: FaInstagram,
  },
  {
    key: "snapchat",
    href: process.env.NEXT_PUBLIC_SOCIAL_MEDIA_SNAPCHAT_LINK,
    icon: FaSnapchat,
  },
  {
    key: "linkedin",
    href: process.env.NEXT_PUBLIC_SOCIAL_MEDIA_LINKEDIN_LINK,
    icon: FaLinkedinIn,
  },
  {
    key: "tiktok",
    href: process.env.NEXT_PUBLIC_SOCIAL_MEDIA_TIKTOK_LINK,
    icon: FaTiktok,
  },
];

const SocialMediaLinks = () => {
  const activeLinks = socialLinks.filter(({ href }) => href && href !== "#");

  if (activeLinks.length === 0) return null;

  return (
    <ul className="flex items-center gap-3 sm:gap-4">
      {activeLinks.map(({ key, href, icon: Icon }) => (
        <li key={key}>
          <Link
            href={href!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={key}
            className="text-text-primary-200 hover:text-primary-500 transition-colors duration-200"
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SocialMediaLinks;
