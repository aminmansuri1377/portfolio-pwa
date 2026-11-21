import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Section, Reveal } from '../ui';
import { SKILL_GROUPS } from '../../lib/skills';

export default function Skills() {
  const t = useTranslations('Skills');
  return (
    <Section id="skills" kicker={t('kicker')} title={t('title')} subtitle={t('subtitle')}>
      <div className="grid gap-6 md:grid-cols-2">
        {SKILL_GROUPS.map((group, i) => (
          <Reveal key={group.key} delay={0.07 * i}>
            <div className="glass h-full rounded-2xl p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-lime">
                {t(`categories.${group.key}`)}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {group.items.map((skill) => (
                  <motion.div
                    key={skill.name}
                    whileHover={{ y: -4 }}
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-ink-900/80 px-3.5 py-2.5"
                  >
                    <Image
                      src={skill.icon}
                      alt=""
                      width={22}
                      height={22}
                      className="h-[22px] w-[22px] object-contain"
                    />
                    <span className="text-sm text-white/90">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
