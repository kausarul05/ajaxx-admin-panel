import React from 'react';

export default function PlansManagement() {
    const plans = [
        {
            name: "Basic Protection",
            description: "All features included to keep your personal data safe.",
            price: "$10 /month",
            features: [
                "Identities: up to 10",
                "Scans / month: 10",
                "Automated Data Removal",
                "PDF export: Unlimited",
                "Support: (24–48h)"
            ],
            popular: false
        },
        {
            name: "Silver Protection",
            description: "All features included to keep your personal data safe.",
            price: "$20 /month",
            features: [
                "Identities: up to 20",
                "Scans / month: 20",
                "Automated Data Removal",
                "PDF export: 20",
                "Support: (24–48h)"
            ],
            popular: false
        },
        {
            name: "Gold Protection",
            description: "All features included to keep your personal data safe.",
            price: "$30 /month",
            features: [
                "Identities: Unlimited",
                "Scans / month: Unlimited",
                "Automated Data Removal",
                "Scans / month: Unlimited",
                "Support: (24–48h)"
            ],
            popular: true
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Plans Management</h1>
                <p className="text-gray-600">Manage and customize your subscription plans</p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                    <div
                        key={plan.name}
                        className={`bg-white rounded-lg shadow-sm border-2 ${plan.popular ? 'border-blue-500 relative' : 'border-gray-200'
                            }`}
                    >
                        {/* Popular Badge */}
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        {/* Plan Header */}
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                            <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                        </div>

                        {/* Features List */}
                        <div className="p-6">
                            <ul className="space-y-3">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start">
                                        <svg
                                            className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Button */}
                        <div className="p-6 pt-0">
                            <button
                                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${plan.popular
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {plan.popular ? 'Get Started' : 'Choose Plan'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}