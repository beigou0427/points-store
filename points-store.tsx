import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Search, 
  Filter, 
  ChevronDown, 
  Clock, 
  Play,
  TrendingUp,
  ShoppingBag,
  Coffee,
  Gamepad2,
  Tv,
  AlertTriangle,
  Heart,
  Share2,
  Info,
  Star,
  ArrowRight
} from 'lucide-react';

// 常數定義
const PRICE_TIERS = {
  BASIC: { value: 100, points: 300 },
  STANDARD: { value: 150, points: 450 },
  PREMIUM: { value: 200, points: 600 },
  DELUXE: { value: 300, points: 900 },
  ELITE: { value: 500, points: 1500 },
  ULTIMATE: { value: 1000, points: 3000 }
};

const categories = [
  { id: 'all', name: '全部商品', icon: Gift },
  { id: 'food', name: '美食餐飲', icon: Coffee },
  { id: 'shopping', name: '購物優惠', icon: ShoppingBag },
  { id: 'games', name: '遊戲點數', icon: Gamepad2 },
  { id: 'entertainment', name: '休閒娛樂', icon: Tv }
];

const allRewards = [
  {
    id: 1,
    category: 'food',
    title: '星巴克中杯飲品兌換券',
    ...PRICE_TIERS.BASIC,
    merchantName: 'Starbucks',
    thumbnail: '/api/placeholder/320/200',
    expiryDays: 60,
    totalClaimed: 4280,
    trending: true,
    tags: ['咖啡', '飲品']
  },
  {
    id: 2,
    category: 'games',
    title: 'Steam 遊戲點數卡',
    ...PRICE_TIERS.BASIC,
    merchantName: 'Steam',
    thumbnail: '/api/placeholder/320/200',
    expiryDays: 365,
    totalClaimed: 2180,
    tags: ['遊戲', 'PC遊戲']
  },
  {
    id: 3,
    category: 'entertainment',
    title: 'Netflix 標準方案月費',
    ...PRICE_TIERS.STANDARD,
    merchantName: 'Netflix',
    thumbnail: '/api/placeholder/320/200',
    expiryDays: 60,
    totalClaimed: 2890,
    trending: true,
    tags: ['影音', '串流']
  },
  {
    id: 4,
    category: 'shopping',
    title: '誠品生活禮券',
    ...PRICE_TIERS.PREMIUM,
    merchantName: '誠品',
    thumbnail: '/api/placeholder/320/200',
    expiryDays: 180,
    totalClaimed: 1450,
    tags: ['書店', '文創']
  },
  {
    id: 5,
    category: 'games',
    title: 'PS Store 豪華點數卡',
    ...PRICE_TIERS.ELITE,
    merchantName: 'PlayStation',
    thumbnail: '/api/placeholder/320/200',
    expiryDays: 365,
    totalClaimed: 580,
    isLimited: true,
    stockLeft: 30,
    tags: ['遊戲', 'PS5']
  }
];

const userInfo = {
  points: 1500,
  rank: "探索者 Lv.2",
  nextPoints: 500,
  dailyTasks: [
    { title: "觀看影片", progress: 2, total: 3, points: 2 },
    { title: "參與討論", progress: 1, total: 3, points: 1 }
  ]
};

// ProgressBar 元件
const ProgressBar = ({ progress, total }) => {
  const percentage = Math.min((progress / total) * 100, 100);
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className="h-full rounded-full bg-blue-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const PointsStore = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [rewards, setRewards] = useState(allRewards);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [sortOrder, setSortOrder] = useState('popular');
  const [favoriteRewards, setFavoriteRewards] = useState(new Set());
  const [showRewardDetail, setShowRewardDetail] = useState(false);

  // 推薦商品計算
  const getRecommendations = (reward) => {
    return allRewards
      .filter(r => r.id !== reward.id && r.category === reward.category)
      .sort((a, b) => b.totalClaimed - a.totalClaimed)
      .slice(0, 3);
  };

  // 收藏功能
  const toggleFavorite = (rewardId) => {
    setFavoriteRewards(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(rewardId)) {
        newFavorites.delete(rewardId);
      } else {
        newFavorites.add(rewardId);
      }
      return newFavorites;
    });
  };

  // 分享功能（模擬）
  const shareReward = (reward) => {
    alert(`分享功能開發中：${reward.title}`);
  };

  // 商品詳情對話框
  const RewardDetailModal = () => {
    if (!selectedReward || !showRewardDetail) return null;
    
    const recommendations = getRecommendations(selectedReward);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <img 
              src={selectedReward.thumbnail} 
              alt={selectedReward.title}
              className="w-full h-64 object-cover rounded-t-xl"
            />
            <button 
              onClick={() => toggleFavorite(selectedReward.id)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-50"
            >
              <Heart 
                className={`h-5 w-5 ${
                  favoriteRewards.has(selectedReward.id) 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-600'
                }`} 
              />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/api/placeholder/32/32" 
                alt={selectedReward.merchantName}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium">{selectedReward.merchantName}</div>
                <div className="text-sm text-gray-500">合作商家</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">{selectedReward.title}</h2>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedReward.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">點數要求</div>
                <div className="text-lg font-semibold text-blue-600">
                  {selectedReward.points.toLocaleString()} 點
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">市場價值</div>
                <div className="text-lg font-semibold">
                  NT$ {selectedReward.value.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">使用期限</div>
                <div className="text-lg font-semibold">
                  {selectedReward.expiryDays} 天
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">已兌換次數</div>
                <div className="text-lg font-semibold">
                  {selectedReward.totalClaimed.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">商品說明</h3>
              <div className="space-y-2 text-gray-600">
                <p>• 兌換後將發送兌換碼至您的電子信箱</p>
                <p>• 請在期限內至合作商家門市或線上商店使用</p>
                <p>• 本商品不可退換、不找零</p>
                {selectedReward.isLimited && (
                  <p className="text-red-500">• 限量商品，僅剩 {selectedReward.stockLeft} 份</p>
                )}
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">推薦商品</h3>
                <div className="grid grid-cols-3 gap-4">
                  {recommendations.map(rec => (
                    <div 
                      key={rec.id}
                      className="p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedReward(rec);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <img 
                        src={rec.thumbnail}
                        alt={rec.title}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <div className="text-sm font-medium line-clamp-2">{rec.title}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {rec.points.toLocaleString()} 點
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowRewardDetail(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                返回列表
              </button>
              <button
                onClick={() => {
                  setShowRewardDetail(false);
                  setShowConfirmModal(true);
                }}
                className={`flex-1 px-4 py-3 rounded-lg ${
                  userInfo.points >= selectedReward.points
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={userInfo.points < selectedReward.points}
              >
                立即兌換
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 修改 RewardCard 組件，添加收藏和詳情按鈕
  const RewardCard = ({ reward }) => (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img 
          src={reward.thumbnail} 
          alt={reward.title}
          className="w-full h-48 object-cover rounded-t-xl cursor-pointer"
          onClick={() => {
            setSelectedReward(reward);
            setShowRewardDetail(true);
          }}
        />
        {reward.trending && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs rounded-full flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            熱門商品
          </div>
        )}
        {reward.isLimited && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs rounded-full flex items-center gap-2">
            <AlertTriangle className="h-3 w-3" />
            限量 {reward.stockLeft}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <img src="/api/placeholder/24/24" className="w-6 h-6 rounded-full" alt={reward.merchantName} />
          {reward.merchantName}
        </div>
        <h3 
          className="text-lg font-medium mb-4 text-gray-900 hover:text-blue-600 line-clamp-2 cursor-pointer"
          onClick={() => {
            setSelectedReward(reward);
            setShowRewardDetail(true);
          }}
        >
          {reward.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{reward.expiryDays}天內有效</span>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {reward.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => toggleFavorite(reward.id)}
            className="p-2 hover:bg-gray-50 rounded-full"
          >
            <Heart 
              className={`h-5 w-5 ${
                favoriteRewards.has(reward.id) 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400'
              }`} 
            />
          </button>
          <button
            onClick={() => shareReward(reward)}
            className="p-2 hover:bg-gray-50 rounded-full"
          >
            <Share2 className="h-5 w-5 text-gray-400" />
          </button>
          <button
            onClick={() => {
              setSelectedReward(reward);
              setShowRewardDetail(true);
            }}
            className="p-2 hover:bg-gray-50 rounded-full"
          >
            <Info className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500">市值 {reward.value.toLocaleString()}元</div>
            <div className="text-lg font-semibold text-blue-600">
              {reward.points.toLocaleString()} <span className="text-sm">點</span>
            </div>
          </div>
          <button 
            onClick={() => handleRewardClick(reward)}
            className={`px-4 py-2 rounded-lg transition-all ${
              userInfo.points >= reward.points
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={userInfo.points < reward.points}
          >
            {userInfo.points >= reward.points ? '立即兌換' : '點數不足'}
          </button>
        </div>
      </div>
    </div>
  );

  // 保留原有的 filterAndSortRewards, handleRewardClick, ConfirmModal...

  return (
    <div className="min-h-screen bg-gray-50">
      {showConfirmModal && <ConfirmModal />}
      {showRewardDetail && <RewardDetailModal />}
      
      <nav className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-900">
            ValueShare<span className="text-blue-600">.</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
              <Gift className="h-4 w-4" />
              <span>{userInfo.points.toLocaleString()} 點</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 rounded-xl p-6 text-white">
            <div className="text-2xl font-bold mb-2">{userInfo.rank}</div>
            <div className="text-sm text-blue-100 mb-4">
              距離升級還需 {userInfo.nextPoints.toLocaleString()} 點
            </div>
            <ProgressBar progress={userInfo.points} total={userInfo.nextPoints + userInfo.points} />
          </div>

          <div className="bg-white rounded-xl p-6 md:col-span-2">
            <h2 className="text-lg font-medium mb-4">每日任務</h2>
            <div className="space-y-4">
              {userInfo.dailyTasks.map((task, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-blue-600" />
                      <span>{task.title}</span>
                    </div>
                    <span className="text-orange-500">+{task.points}點</span>
                  </div>
                  <ProgressBar progress={task.progress} total={task.total} />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {task.progress}/{task.total}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="搜尋商品"
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-white rounded-lg border border-gray-200"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="popular">依熱門程度</option>
            <option value="price-low">價格由低到高</option>
            <option value="price-high">價格由高到低</option>
          </select>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}>
          {rewards.map(reward => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PointsStore;