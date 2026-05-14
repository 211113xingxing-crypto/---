'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check, User, Building2, Phone, MapPin, FileText } from 'lucide-react';

interface District {
  id: number;
  name: string;
  slug: string;
  level: string;
}

interface ServiceType {
  id: number;
  name: string;
  slug: string;
}

interface City {
  id: number;
  name: string;
  slug: string;
}

const STEPS = ['选择类型', '基本信息', '服务设置', '确认提交'];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Step 0: type selection
  const [providerType, setProviderType] = useState<'individual' | 'agency'>('individual');

  // Step 1: basic info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cityId, setCityId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [addressText, setAddressText] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');

  // Step 2: services
  const [bio, setBio] = useState('');
  const [serviceTypeIds, setServiceTypeIds] = useState<number[]>([]);

  // Data
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

  useEffect(() => {
    // Fetch cities
    fetch('/api/trpc/city.list')
      .then(r => r.json())
      .then(d => {
        const data = d.result?.data;
        setCities(Array.isArray(data) ? data : data?.json ?? []);
      })
      .catch(() => {});

    // Fetch service types
    fetch('/api/trpc/provider.getServiceTypes')
      .then(r => r.json())
      .then(d => {
        const data = d.result?.data;
        setServiceTypes(Array.isArray(data) ? data : data?.json ?? []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!cityId) {
      setDistricts([]);
      return;
    }
    fetch(`/api/admin/districts?cityId=${cityId}`)
      .then(r => r.json())
      .then(d => setDistricts(d.data ?? []))
      .catch(() => {});
  }, [cityId]);

  function validateStep(s: number): boolean {
    if (s === 0) return true;
    if (s === 1) {
      if (!name.trim() || !phone || !password || !cityId) {
        setError('请填写所有必填信息');
        return false;
      }
      if (password.length < 6) {
        setError('密码至少6位');
        return false;
      }
    }
    if (s === 2) {
      if (serviceTypeIds.length === 0) {
        setError('请至少选择一种服务类型');
        return false;
      }
    }
    setError('');
    return true;
  }

  function nextStep() {
    if (validateStep(step + 1)) {
      setStep(s => Math.min(s + 1, STEPS.length - 1));
    }
  }

  function prevStep() {
    setError('');
    setStep(s => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/provider/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          password,
          name,
          providerType,
          cityId,
          districtId,
          addressText: addressText || null,
          bio: bio || null,
          gender: gender || null,
          age: age ? parseInt(age) : null,
          yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
          serviceTypeIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '提交失败');
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">申请已提交</h1>
          <p className="text-zinc-600 mb-6">
            您的入驻申请已提交，我们会在1-2个工作日内审核。审核通过后，您可以使用手机号登录服务者后台。
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 mt-3">服务者入驻申请</h1>
          <p className="text-zinc-500 text-sm mt-1">
            填写以下信息，通过审核后即可上线接单
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    i < step
                      ? 'bg-emerald-600 text-white'
                      : i === step
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-600'
                      : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs mt-1 ${i <= step ? 'text-emerald-700' : 'text-zinc-400'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 ${i < step ? 'bg-emerald-600' : 'bg-zinc-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">选择您的服务类型</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setProviderType('individual')}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    providerType === 'individual'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <User className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                  <div className="font-semibold text-zinc-900">个人护工</div>
                  <div className="text-xs text-zinc-500 mt-1">以个人身份提供服务</div>
                </button>
                <button
                  onClick={() => setProviderType('agency')}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    providerType === 'agency'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                  <div className="font-semibold text-zinc-900">护理机构</div>
                  <div className="text-xs text-zinc-500 mt-1">以机构身份提供服务</div>
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">基本信息</h2>
              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-1">
                  {providerType === 'individual' ? '姓名' : '机构名称'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={providerType === 'individual' ? '请输入您的姓名' : '请输入机构全称'}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700 block mb-1">
                    手机号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="将作为登录账号"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 block mb-1">
                    密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="至少6位"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-1">
                  服务城市 <span className="text-red-500">*</span>
                </label>
                <select
                  value={cityId ?? ''}
                  onChange={(e) => { setCityId(e.target.value ? parseInt(e.target.value) : null); setDistrictId(null); }}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">请选择城市</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              {districts.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-zinc-700 block mb-1">服务区域</label>
                  <select
                    value={districtId ?? ''}
                    onChange={(e) => setDistrictId(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">请选择区域（可选）</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-1">详细地址</label>
                <input
                  type="text"
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="如 XX路XX号（选填）"
                />
              </div>
              {providerType === 'individual' && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-700 block mb-1">性别</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="male">男</option>
                      <option value="female">女</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700 block mb-1">年龄</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="选填"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700 block mb-1">从业年限</label>
                    <input
                      type="number"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="选填"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">服务设置</h2>
              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-2">
                  服务类型 <span className="text-red-500">*</span>（可多选）
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {serviceTypes.map((st) => (
                    <label
                      key={st.id}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer text-sm transition-all ${
                        serviceTypeIds.includes(st.id)
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={serviceTypeIds.includes(st.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setServiceTypeIds(prev => [...prev, st.id]);
                          } else {
                            setServiceTypeIds(prev => prev.filter(id => id !== st.id));
                          }
                        }}
                        className="sr-only"
                      />
                      <span className="font-medium text-zinc-800">{st.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-1">个人/机构简介</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="介绍您或机构的服务经验、专长、服务理念等（选填）"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">确认提交</h2>
              <div className="bg-zinc-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">类型</span>
                  <span className="font-medium">{providerType === 'individual' ? '个人护工' : '护理机构'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">{providerType === 'individual' ? '姓名' : '机构名称'}</span>
                  <span className="font-medium">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">手机号</span>
                  <span className="font-medium">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">服务城市</span>
                  <span className="font-medium">{cities.find(c => c.id === cityId)?.name ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">服务类型</span>
                  <span className="font-medium text-right">
                    {serviceTypeIds.map(id => serviceTypes.find(s => s.id === id)?.name).filter(Boolean).join('、') || '—'}
                  </span>
                </div>
                {bio && (
                  <div>
                    <span className="text-zinc-500 block mb-1">简介</span>
                    <p className="text-zinc-700">{bio}</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                提交后，管理员将在1-2个工作日内审核您的信息。审核通过后即可上线展示并接收用户咨询。
              </p>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-2.5 mt-4">{error}</p>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t border-zinc-100">
            {step > 0 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-1 px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> 上一步
              </button>
            ) : (
              <div />
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-1 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                下一步 <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Check className="w-4 h-4" />
                {submitting ? '提交中...' : '提交申请'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
