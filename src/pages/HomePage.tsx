import React, { useEffect, useState } from "react";
import {
  Heart,
  Shield,
  Users,
  MessageCircle,
  Star,
  Lock,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import WalletConnect from "../components/WalletConnect";
import { MatchForm } from "../components/MatchForm";
// import { MatchingPage } from '../pages/MatchingPage';
// import { ChatPage } from '../pages/ChatPage';
import type { FormData } from "../types";

function HomePage() {

  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    setIsFormOpen(false);
    navigate("/matching");
  };

  useEffect(() => {
    const profile_success = localStorage.getItem("profile_success");
    if (!profile_success) {
     window.location.href = "/create";
    }
  }, []);


  return (
          <div className="min-h-screen bg-[#FFF8F8]">
            <div className="relative bg-gradient-to-br from-red-50 via-white to-orange-50 pb-20">
              <div className="absolute inset-0 bg-grid-black/[0.02] bg-center"></div>
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FFF8F8] to-transparent"></div>

              <WalletConnect />

              <div className="relative container mx-auto px-4 pt-16">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="mb-6 inline-block p-2 bg-white/50 backdrop-blur-sm rounded-full">
                    <p className="text-red-600 font-medium px-4">
                      Web3's Most Trusted Dating Platform
                    </p>
                  </div>
                  <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-transparent bg-clip-text">
                    Find Your Perfect Match
                  </h1>
                  <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
                    Discover authentic connections in the Web3 space. Where
                    passion meets blockchain technology.
                  </p>

                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-full hover:from-red-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-300/50"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Start Your Journey
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="container mx-auto px-4 mt-10">
              <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  {
                    value: "50K+",
                    label: "Active Users",
                    color: "from-red-500",
                  },
                  {
                    value: "10K+",
                    label: "Successful Matches",
                    color: "from-rose-500",
                  },
                  { value: "100+", label: "Countries", color: "from-red-500" },
                  {
                    value: "500+",
                    label: "Communities",
                    color: "from-rose-500",
                  },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <p
                      className={`text-3xl font-bold bg-gradient-to-r ${stat.color} to-red-600 text-transparent bg-clip-text mb-1`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Features */}
            <div className="container mx-auto px-4 py-24">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 text-transparent bg-clip-text mb-4">
                  Why Choose Us?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Experience a dating platform that prioritizes authenticity,
                  security, and meaningful connections in the Web3 space.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Shield,
                    title: "Verified Profiles",
                    description:
                      "Every profile is authenticated through blockchain technology, ensuring real connections.",
                    color: "from-red-500",
                  },
                  {
                    icon: Lock,
                    title: "Privacy First",
                    description:
                      "Your data is encrypted and secured by zero-knowledge proofs, keeping your information safe.",
                    color: "from-rose-500",
                  },
                  {
                    icon: Globe,
                    title: "Global Community",
                    description:
                      "Connect with crypto enthusiasts and Web3 natives from around the world.",
                    color: "from-red-500",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} to-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-b from-white to-red-50 py-24">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 text-transparent bg-clip-text mb-4">
                    Your Path to Love
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    A simple four-step journey to finding your perfect match in
                    the Web3 world
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    {
                      icon: Users,
                      title: "Connect Wallet",
                      description:
                        "Verify your identity securely with your Web3 wallet",
                    },
                    {
                      icon: Star,
                      title: "Create Profile",
                      description: "Share your interests and crypto journey",
                    },
                    {
                      icon: Heart,
                      title: "Find Matches",
                      description: "Connect with compatible Web3 enthusiasts",
                    },
                    {
                      icon: MessageCircle,
                      title: "Start Chatting",
                      description: "Begin conversations in our secure platform",
                    },
                  ].map((step, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 text-center">
                          {step.description}
                        </p>
                      </div>
                      {index < 3 && (
                        <div className="hidden md:block absolute top-1/2 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-red-300 to-transparent"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="container mx-auto px-4 py-24">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 text-transparent bg-clip-text mb-4">
                  Success Stories
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Real stories from our Web3 community members who found love on
                  our platform
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    quote:
                      "Found my crypto soulmate here! We bonded over our shared passion for DeFi.",
                    name: "Alex & Sarah",
                    role: "Matched 6 months ago",
                  },
                  {
                    quote:
                      "The verification process made me feel safe. Now we're building our own NFT project together!",
                    name: "Michael & Jessica",
                    role: "Matched 1 year ago",
                  },
                  {
                    quote:
                      "Finally, a dating platform that understands the Web3 lifestyle. Thank you!",
                    name: "David & Emma",
                    role: "Matched 3 months ago",
                  },
                ].map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <p className="text-gray-600 italic mb-6">
                          "{testimonial.quote}"
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {testimonial.name}
                        </p>
                        <p className="text-red-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="container mx-auto px-4 py-24 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 text-transparent bg-clip-text mb-6">
                  Ready to Meet Your Crypto Soulmate?
                </h2>
                <p className="text-gray-600 mb-8">
                  Join thousands of Web3 enthusiasts who have already found
                  their perfect match
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-full hover:from-red-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-300/50"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Find Your Match Now
                </button>
              </div>
            </div>

            <MatchForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSubmit={handleSubmit}
            />
          </div>
      
  );
}

export default HomePage;
