import React from 'react';

const FooterLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
  <li><a href={href} className="hover:text-accent transition-colors duration-300">{children}</a></li>
);

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-text-secondary hover:text-accent transition-colors duration-300">{children}</a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary border-t border-white/5 mt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-serif font-bold text-text-primary mb-2">1Shift Down</h3>
            <p className="text-text-secondary">Buy Smart. Drive Confident.</p>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary mb-4 tracking-wider uppercase text-sm">Company</h4>
            <ul className="space-y-3 text-text-secondary">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary mb-4 tracking-wider uppercase text-sm">Legal</h4>
            <ul className="space-y-3 text-text-secondary">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary mb-4 tracking-wider uppercase text-sm">Follow Us</h4>
            <div className="flex space-x-5">
              <SocialIcon href="#">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218 1.791.465 2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zm0 1.623c-2.372 0-2.69.01-3.638.056-.98.045-1.504.207-1.857.344-.467.182-.86.399-1.249.787a3.273 3.273 0 00-.787 1.249c-.137.353-.3.877-.344 1.857-.046.948-.056 1.266-.056 3.638s.01 2.69.056 3.638c.045.98.207 1.504.344 1.857.182.466.399.86.787 1.249a3.273 3.273 0 001.249.787c.353.137.877.3 1.857.344.948.046 1.266.056 3.638.056s2.69-.01 3.638-.056c.98-.045 1.504-.207 1.857-.344.467-.182.86-.399 1.249-.787a3.273 3.273 0 00.787-1.249c.137-.353.3-.877.344-1.857.046-.948.056-1.266-.056-3.638s-.01-2.69-.056-3.638c-.045-.98-.207-1.504-.344-1.857a3.273 3.273 0 00-.787-1.249 3.273 3.273 0 00-1.249-.787c-.353-.137-.877-.3-1.857-.344-.948-.046-1.266-.056-3.638-.056zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 1.623a3.512 3.512 0 110 7.024 3.512 3.512 0 010-7.024zM16.338 5.11a1.472 1.472 0 100 2.944 1.472 1.472 0 000-2.944z" clipRule="evenodd" /></svg>
              </SocialIcon>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/5 pt-8 text-center text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} 1Shift Down. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;