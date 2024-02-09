import { Globe, Twitter } from "lucide-react"

  
  const navigation = [
    {
      name: 'Twitter',
      href: '#',
      icon: <Twitter  className="w-5 h-5" />,
    },

    {
      name: 'Website',
      href: '#',
      icon: <Globe className="w-5 h-5" />,
    },
  ]
  
  export const Footer = () => {
    return (
      <footer className="mt-auto bg-secondary">
        <div className="w-full px-6 py-8 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">{item.name}</span>
                {item.icon}
              </a>
            ))}
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-xs leading-5 text-center text-gray-500">
              © {new Date().getFullYear()} Degen Raffle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    )
  }
  