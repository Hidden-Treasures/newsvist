"use client";

import { formatDateOfBirth } from "@/helper/helper";
import Link from "next/link";
import React, { ReactNode } from "react";
import { Award, Facebook, Globe, Instagram, Star } from "react-feather";
import { XIcon } from "react-share";
import { motion } from "framer-motion";
import Image from "next/image";
import SocialLinks from "./SocialLinks";
import BioRelatedArticle from "./BioRelatedArticles";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const BiographyClient = async ({ data }: { data: any }) => {
  if (!data) return <p>Biography not found.</p>;

  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-start bg-gradient-to-r from-purple-900 via-black to-gray-900 text-white min-h-screen">
        {/* Left Section: Details */}
        <motion.div
          className="md:w-1/2 px-8 py-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Link
            href="/biographies"
            className="text-gray-400 hover:text-white text-sm mb-6 block transition-colors"
          >
            ← Back to Biographies
          </Link>

          {data?.stageName && (
            <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
              {data.stageName}
            </h1>
          )}
          {data?.realName && (
            <p className="text-lg text-gray-300 italic mb-6">{data.realName}</p>
          )}

          <div className="space-y-3 text-sm">
            {data?.aliasName && <Detail label="Alias" value={data.aliasName} />}
            {data?.dateOfBirth && (
              <Detail
                label="Born"
                value={formatDateOfBirth(data.dateOfBirth)}
              />
            )}
            {data?.placeOfBirth && (
              <Detail label="Place of Birth" value={data.placeOfBirth} />
            )}
            {data?.nationality && (
              <Detail label="Nationality" value={data.nationality} />
            )}
            {data?.gender && <Detail label="Gender" value={data.gender} />}
            {data?.hometown && (
              <Detail label="Hometown" value={data.hometown} />
            )}
            {data?.label && <Detail label="Label" value={data.label} />}
            {data?.position && (
              <Detail label="Position" value={data.position} />
            )}
            {data?.niche && <Detail label="Niche" value={data.niche} />}
            {data?.genre && <Detail label="Genre" value={data.genre} />}
            {data?.club && <Detail label="Club" value={data.club} />}
            {data?.occupations?.length > 0 && (
              <Detail label="Occupations" value={data.occupations.join(", ")} />
            )}
            {data?.activeYears && (
              <Detail label="Active Years" value={data.activeYears} />
            )}
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 mt-6">
            <SocialLinks socialMedia={data.socialMedia} />
          </div>
        </motion.div>

        {/* Right Section: Image */}
        <motion.div
          className="md:w-1/2 flex items-center justify-center p-8"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Image
            src={data.image}
            alt={data.realName}
            width={500}
            height={500}
            className="rounded-3xl shadow-lg w-full max-w-md object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* Biography Section */}
      <AnimatedSection title="Biography">
        <p className="text-lg leading-relaxed text-gray-800">{data.bio}</p>
      </AnimatedSection>

      {/* Notable Works */}
      {data?.notableWorks && data?.notableWorks?.length > 0 && (
        <AnimatedSection title="Notable Works">
          <ul className="list-disc pl-6 space-y-1">
            {data.notableWorks.map((work: string, i: number) => (
              <li key={i} className="text-gray-700">
                {work}
              </li>
            ))}
          </ul>
        </AnimatedSection>
      )}

      {/* Awards */}
      {data?.awards && data?.awards?.length > 0 && (
        <AnimatedSection
          title="Awards"
          icon={<Award className="text-yellow-500" />}
        >
          <ul className="list-disc pl-6 space-y-1">
            {data.awards.map((award: string, i: number) => (
              <li key={i} className="text-gray-700">
                {award}
              </li>
            ))}
          </ul>
        </AnimatedSection>
      )}

      {/* Quotes */}
      {data?.quotes && data?.quotes?.length > 0 && (
        <AnimatedSection
          title="Famous Quotes"
          icon={<Star className="text-purple-600" />}
        >
          <div className="space-y-4">
            {data.quotes.map((quote: string, i: number) => (
              <blockquote
                key={i}
                className="border-l-4 border-purple-500 pl-4 italic text-gray-700"
              >
                “{quote}”
              </blockquote>
            ))}
          </div>
        </AnimatedSection>
      )}
      <BioRelatedArticle
        realName={data?.realName}
        stageName={data?.stageName}
      />
    </>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-start">
    <p className="text-gray-400 w-40 uppercase">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const AnimatedSection = ({
  title,
  children,
  icon,
}: {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}) => (
  <motion.section
    className="bg-gray-50 py-10 px-6 md:px-16 border-b border-gray-200"
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    <h2 className="text-3xl font-bold flex items-center gap-2 mb-6">
      {icon} {title}
    </h2>
    {children}
  </motion.section>
);

export default BiographyClient;
